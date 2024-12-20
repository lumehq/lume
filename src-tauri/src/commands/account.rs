use keyring::Entry;
use nostr_connect::prelude::*;
use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::{str::FromStr, time::Duration};
use tauri::{Emitter, State};

use crate::{common::get_all_accounts, Nostr, Settings};

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
struct Account {
    secret_key: String,
    nostr_connect: Option<String>,
}

#[derive(Debug, Clone)]
struct AuthHandler;

#[async_trait::async_trait]
impl AuthUrlHandler for AuthHandler {
    async fn on_auth_url(&self, auth_url: Url) -> Result<()> {
        webbrowser::open(auth_url.as_str())?;
        Ok(())
    }
}

#[tauri::command]
#[specta::specta]
pub fn get_accounts() -> Vec<String> {
    get_all_accounts()
}

#[tauri::command]
#[specta::specta]
pub async fn watch_account(id: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let public_key = PublicKey::from_str(&id).map_err(|e| e.to_string())?;
    let npub = public_key.to_bech32().map_err(|e| e.to_string())?;
    let keyring = Entry::new("Lume Safe Storage", &npub).map_err(|e| e.to_string())?;

    // Set empty password
    keyring.set_password("").map_err(|e| e.to_string())?;

    // Get user's profile
    let _ = client
        .fetch_metadata(public_key, Some(Duration::from_secs(4)))
        .await;

    Ok(npub)
}

#[tauri::command]
#[specta::specta]
pub async fn import_account(
    key: String,
    password: Option<String>,
    state: State<'_, Nostr>,
) -> Result<String, String> {
    let client = &state.client;

    // Create secret key
    let secret_key = if let Some(pw) = password {
        let enc = EncryptedSecretKey::from_bech32(key).map_err(|err| err.to_string())?;
        enc.to_secret_key(pw).map_err(|err| err.to_string())?
    } else {
        SecretKey::from_str(&key).map_err(|err| err.to_string())?
    };

    let hex = secret_key.to_secret_hex();
    let keys = Keys::new(secret_key);

    let public_key = keys.public_key();
    let npub = public_key.to_bech32().map_err(|err| err.to_string())?;

    let keyring = Entry::new("Lume Safe Storage", &npub).map_err(|e| e.to_string())?;

    let account = Account {
        secret_key: hex,
        nostr_connect: None,
    };

    // Save secret key to keyring
    let pwd = serde_json::to_string(&account).map_err(|e| e.to_string())?;
    keyring.set_password(&pwd).map_err(|e| e.to_string())?;

    // Update signer
    client.set_signer(keys).await;

    Ok(npub)
}

#[tauri::command]
#[specta::specta]
pub async fn connect_account(uri: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let bunker_uri = NostrConnectURI::parse(&uri).map_err(|err| err.to_string())?;

    // Local user
    let app_keys = Keys::generate();
    let app_secret = app_keys.secret_key().to_secret_hex();

    // Get remote user
    let remote_user = bunker_uri.remote_signer_public_key().unwrap();
    let remote_npub = remote_user.to_bech32().map_err(|err| err.to_string())?;

    // Init nostr connect
    let mut nostr_connect = NostrConnect::new(bunker_uri, app_keys, Duration::from_secs(120), None)
        .map_err(|err| err.to_string())?;

    // Handle auth url
    nostr_connect.auth_url_handler(AuthHandler);

    let keyring = Entry::new("Lume Safe Storage", &remote_npub).map_err(|err| err.to_string())?;

    let reuse_bunker = nostr_connect
        .bunker_uri()
        .await
        .map_err(|err| err.to_string())?;

    let mut reuse_uri = reuse_bunker.to_string();

    if let Some(secret) = reuse_bunker.secret() {
        let replace = format!("&secret={}", secret);
        reuse_uri = reuse_uri.replace(replace.as_str(), "");
    }

    let account = Account {
        secret_key: app_secret,
        nostr_connect: Some(reuse_uri),
    };

    // Save secret key to keyring
    let pwd = serde_json::to_string(&account).map_err(|e| e.to_string())?;
    keyring.set_password(&pwd).map_err(|e| e.to_string())?;

    // Update signer
    let _ = client.set_signer(nostr_connect).await;

    Ok(remote_npub)
}

#[tauri::command]
#[specta::specta]
pub async fn reset_password(key: String, password: String) -> Result<(), String> {
    let secret_key = SecretKey::from_bech32(key).map_err(|err| err.to_string())?;
    let keys = Keys::new(secret_key.clone());
    let npub = keys.public_key().to_bech32().unwrap();

    let enc = EncryptedSecretKey::new(&secret_key, password, 16, KeySecurity::Medium)
        .map_err(|err| err.to_string())?;
    let enc_bech32 = enc.to_bech32().map_err(|err| err.to_string())?;

    let keyring = Entry::new("Lume Safe Storage", &npub).map_err(|e| e.to_string())?;
    let account = Account {
        secret_key: enc_bech32,
        nostr_connect: None,
    };
    let j = serde_json::to_string(&account).map_err(|e| e.to_string())?;
    let _ = keyring.set_password(&j);

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn get_private_key(id: String) -> Result<String, String> {
    let keyring = Entry::new("Lume Safe Storage", &id).map_err(|e| e.to_string())?;
    let password = keyring.get_password().map_err(|e| e.to_string())?;
    let account: Account = serde_json::from_str(&password).map_err(|e| e.to_string())?;

    Ok(account.secret_key)
}

#[tauri::command]
#[specta::specta]
pub fn delete_account(id: String) -> Result<(), String> {
    let keyring = Entry::new("Lume Safe Storage", &id).map_err(|e| e.to_string())?;
    let _ = keyring.delete_credential();

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn has_signer(id: String, state: State<'_, Nostr>) -> Result<bool, String> {
    let client = &state.client;
    let public_key = PublicKey::from_str(&id).map_err(|e| e.to_string())?;

    match client.signer().await {
        Ok(signer) => {
            let signer_key = signer.get_public_key().await.map_err(|e| e.to_string())?;
            let is_match = signer_key == public_key;

            Ok(is_match)
        }
        Err(_) => Ok(false),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn set_signer(
    id: String,
    state: State<'_, Nostr>,
    handle: tauri::AppHandle,
) -> Result<(), String> {
    let client = &state.client;
    let keyring = Entry::new("Lume Safe Storage", &id).map_err(|e| e.to_string())?;

    let account = match keyring.get_password() {
        Ok(pw) => {
            let account: Account = serde_json::from_str(&pw).map_err(|e| e.to_string())?;

            if account.secret_key.is_empty() {
                return Err("Watch Only account".into());
            };

            account
        }
        Err(e) => return Err(e.to_string()),
    };

    match account.nostr_connect {
        None => {
            let secret_key = SecretKey::from_str(&account.secret_key).map_err(|e| e.to_string())?;
            let keys = Keys::new(secret_key);

            // Update signer
            client.set_signer(keys).await;
            // Emit to front-end
            handle.emit("signer-updated", ()).unwrap();

            Ok(())
        }
        Some(bunker) => {
            let uri = NostrConnectURI::parse(bunker).map_err(|e| e.to_string())?;
            let app_keys = Keys::from_str(&account.secret_key).map_err(|e| e.to_string())?;

            match NostrConnect::new(uri, app_keys, Duration::from_secs(120), None) {
                Ok(mut signer) => {
                    // Handle auth url
                    signer.auth_url_handler(AuthHandler);
                    // Update signer
                    client.set_signer(signer).await;
                    // Emit to front-end
                    handle.emit("signer-updated", ()).unwrap();

                    Ok(())
                }
                Err(e) => Err(e.to_string()),
            }
        }
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_app_settings(state: State<'_, Nostr>) -> Result<Settings, String> {
    let settings = state.settings.read().await.clone();
    Ok(settings)
}

#[tauri::command]
#[specta::specta]
pub async fn set_app_settings(settings: String, state: State<'_, Nostr>) -> Result<(), String> {
    let parsed: Settings = serde_json::from_str(&settings).map_err(|e| e.to_string())?;
    let mut settings = state.settings.write().await;
    // Update state
    settings.clone_from(&parsed);

    Ok(())
}
