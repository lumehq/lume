use keyring::Entry;
use keyring_search::{Limit, List, Search};
use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::{
    collections::HashSet,
    fs::{self, File},
    str::FromStr,
    time::Duration,
};
use tauri::{Emitter, Manager, State};

use crate::{common::init_nip65, Nostr, NOTIFICATION_SUB_ID};

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
struct Account {
    password: String,
    nostr_connect: Option<String>,
}

#[tauri::command]
#[specta::specta]
pub fn get_accounts() -> Vec<String> {
    let search = Search::new().expect("Unexpected.");
    let results = search.by_service("Lume Secret Storage");
    let list = List::list_credentials(&results, Limit::All);
    let accounts: HashSet<String> = list
        .split_whitespace()
        .filter(|v| v.starts_with("npub1"))
        .map(String::from)
        .collect();

    accounts.into_iter().collect()
}

#[tauri::command]
#[specta::specta]
pub async fn create_account(
    name: String,
    about: String,
    picture: String,
    password: String,
    state: State<'_, Nostr>,
) -> Result<String, String> {
    let client = &state.client;
    let keys = Keys::generate();
    let npub = keys.public_key().to_bech32().map_err(|e| e.to_string())?;
    let secret_key = keys.secret_key();
    let enc = EncryptedSecretKey::new(secret_key, password, 16, KeySecurity::Medium)
        .map_err(|err| err.to_string())?;
    let enc_bech32 = enc.to_bech32().map_err(|err| err.to_string())?;

    // Save account
    let keyring = Entry::new("Lume Secret Storage", &npub).map_err(|e| e.to_string())?;
    let account = Account {
        password: enc_bech32,
        nostr_connect: None,
    };
    let j = serde_json::to_string(&account).map_err(|e| e.to_string())?;
    let _ = keyring.set_password(&j);

    let signer = NostrSigner::Keys(keys);

    // Update signer
    client.set_signer(Some(signer)).await;

    let mut metadata = Metadata::new()
        .display_name(name.clone())
        .name(name.to_lowercase())
        .about(about);

    if let Ok(url) = Url::parse(&picture) {
        metadata = metadata.picture(url)
    }

    match client.set_metadata(&metadata).await {
        Ok(_) => Ok(npub),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn import_account(key: String, password: String) -> Result<String, String> {
    let (npub, enc_bech32) = match key.starts_with("ncryptsec") {
        true => {
            let enc = EncryptedSecretKey::from_bech32(key).map_err(|err| err.to_string())?;
            let enc_bech32 = enc.to_bech32().map_err(|err| err.to_string())?;
            let secret_key = enc.to_secret_key(password).map_err(|err| err.to_string())?;
            let keys = Keys::new(secret_key);
            let npub = keys.public_key().to_bech32().unwrap();

            (npub, enc_bech32)
        }
        false => {
            let secret_key = SecretKey::from_bech32(key).map_err(|err| err.to_string())?;
            let keys = Keys::new(secret_key.clone());
            let npub = keys.public_key().to_bech32().unwrap();

            let enc = EncryptedSecretKey::new(&secret_key, password, 16, KeySecurity::Medium)
                .map_err(|err| err.to_string())?;

            let enc_bech32 = enc.to_bech32().map_err(|err| err.to_string())?;

            (npub, enc_bech32)
        }
    };

    let keyring = Entry::new("Lume Secret Storage", &npub).map_err(|e| e.to_string())?;

    let account = Account {
        password: enc_bech32,
        nostr_connect: None,
    };

    let pwd = serde_json::to_string(&account).map_err(|e| e.to_string())?;
    keyring.set_password(&pwd).map_err(|e| e.to_string())?;

    Ok(npub)
}

#[tauri::command]
#[specta::specta]
pub async fn connect_account(uri: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;

    match NostrConnectURI::parse(uri.clone()) {
        Ok(bunker_uri) => {
            // Local user
            let app_keys = Keys::generate();
            let app_secret = app_keys.secret_key().to_secret_hex();

            // Get remote user
            let remote_user = bunker_uri.signer_public_key().unwrap();
            let remote_npub = remote_user.to_bech32().unwrap();

            match Nip46Signer::new(bunker_uri, app_keys, Duration::from_secs(120), None) {
                Ok(signer) => {
                    let mut url = Url::parse(&uri).unwrap();
                    let query: Vec<(String, String)> = url
                        .query_pairs()
                        .filter(|(name, _)| name != "secret")
                        .map(|(name, value)| (name.into_owned(), value.into_owned()))
                        .collect();
                    url.query_pairs_mut().clear().extend_pairs(&query);

                    let key = format!("{}_nostrconnect", remote_npub);
                    let keyring = Entry::new("Lume Secret Storage", &key).unwrap();
                    let account = Account {
                        password: app_secret,
                        nostr_connect: Some(url.to_string()),
                    };
                    let j = serde_json::to_string(&account).map_err(|e| e.to_string())?;
                    let _ = keyring.set_password(&j);

                    // Update signer
                    let _ = client.set_signer(Some(signer.into())).await;

                    Ok(remote_npub)
                }
                Err(err) => Err(err.to_string()),
            }
        }
        Err(err) => Err(err.to_string()),
    }
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

    let keyring = Entry::new("Lume Secret Storage", &npub).map_err(|e| e.to_string())?;
    let account = Account {
        password: enc_bech32,
        nostr_connect: None,
    };
    let j = serde_json::to_string(&account).map_err(|e| e.to_string())?;
    let _ = keyring.set_password(&j);

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn get_private_key(id: String) -> Result<String, String> {
    let keyring = Entry::new("Lume Secret Storage", &id).map_err(|e| e.to_string())?;
    let password = keyring.get_password().map_err(|e| e.to_string())?;

    Ok(password)
}

#[tauri::command]
#[specta::specta]
pub fn delete_account(id: String) -> Result<(), String> {
    let keyring = Entry::new("Lume Secret Storage", &id).map_err(|e| e.to_string())?;
    let _ = keyring.delete_credential();

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn is_account_sync(id: String, handle: tauri::AppHandle) -> bool {
    let config_dir = handle
        .path()
        .app_config_dir()
        .expect("Error: app config directory not found.");

    fs::metadata(config_dir.join(id)).is_ok()
}

#[tauri::command]
#[specta::specta]
pub async fn login(
    account: String,
    password: String,
    state: State<'_, Nostr>,
    handle: tauri::AppHandle,
) -> Result<String, String> {
    let client = &state.client;
    let keyring = Entry::new("Lume Secret Storage", &account).map_err(|e| e.to_string())?;

    let account = match keyring.get_password() {
        Ok(pw) => {
            let account: Account = serde_json::from_str(&pw).map_err(|e| e.to_string())?;
            account
        }
        Err(e) => return Err(e.to_string()),
    };

    let public_key = match account.nostr_connect {
        None => {
            let ncryptsec =
                EncryptedSecretKey::from_bech32(account.password).map_err(|e| e.to_string())?;
            let secret_key = ncryptsec
                .to_secret_key(password)
                .map_err(|_| "Wrong password.")?;
            let keys = Keys::new(secret_key);
            let public_key = keys.public_key().to_bech32().unwrap();
            let signer = NostrSigner::Keys(keys);

            // Update signer
            client.set_signer(Some(signer)).await;

            public_key
        }
        Some(bunker) => {
            let uri = NostrConnectURI::parse(bunker).map_err(|e| e.to_string())?;
            let public_key = uri.signer_public_key().unwrap().to_bech32().unwrap();
            let app_keys = Keys::from_str(&account.password).map_err(|e| e.to_string())?;

            match Nip46Signer::new(uri, app_keys, Duration::from_secs(120), None) {
                Ok(signer) => {
                    // Update signer
                    client.set_signer(Some(signer.into())).await;
                    public_key
                }
                Err(e) => return Err(e.to_string()),
            }
        }
    };

    // NIP-65: Connect to user's relay list
    init_nip65(client, &public_key).await;

    // Run seperate thread for syncing data
    let pk = public_key.clone();
    tauri::async_runtime::spawn(async move {
        let config_dir = handle.path().app_config_dir().unwrap();
        let state = handle.state::<Nostr>();
        let client = &state.client;

        // Convert current user to PublicKey
        let author = PublicKey::from_str(&pk).unwrap();

        // Fetching user's metadata
        if let Ok(report) = client
            .reconcile(
                Filter::new()
                    .author(author)
                    .kinds(vec![
                        Kind::Metadata,
                        Kind::ContactList,
                        Kind::MuteList,
                        Kind::Bookmarks,
                        Kind::Interests,
                        Kind::PinList,
                    ])
                    .limit(1000),
                NegentropyOptions::default(),
            )
            .await
        {
            println!("Received: {}", report.received.len())
        }

        // Fetching user's events
        if let Ok(report) = client
            .reconcile(
                Filter::new()
                    .author(author)
                    .kinds(vec![Kind::TextNote, Kind::Repost])
                    .limit(200),
                NegentropyOptions::default(),
            )
            .await
        {
            println!("Received: {}", report.received.len())
        }

        // Fetching user's notification
        if let Ok(report) = client
            .reconcile(
                Filter::new()
                    .pubkey(author)
                    .kinds(vec![
                        Kind::TextNote,
                        Kind::Repost,
                        Kind::Reaction,
                        Kind::ZapReceipt,
                    ])
                    .limit(200),
                NegentropyOptions::default(),
            )
            .await
        {
            println!("Received: {}", report.received.len())
        }

        // Subscribe for new notification
        if let Ok(e) = client
            .subscribe_with_id(
                SubscriptionId::new(NOTIFICATION_SUB_ID),
                vec![Filter::new()
                    .pubkey(author)
                    .kinds(vec![
                        Kind::TextNote,
                        Kind::Repost,
                        Kind::Reaction,
                        Kind::ZapReceipt,
                    ])
                    .since(Timestamp::now())],
                None,
            )
            .await
        {
            println!("Subscribed: {}", e.success.len())
        }

        // Get user's contact list
        let contact_list = {
            let contacts = client.get_contact_list(None).await.unwrap();
            // Update app's state
            state.contact_list.lock().await.clone_from(&contacts);
            // Return
            contacts
        };

        // Get events from contact list
        if !contact_list.is_empty() {
            let authors: Vec<PublicKey> = contact_list.iter().map(|f| f.public_key).collect();

            // Fetching contact's metadata
            if let Ok(report) = client
                .reconcile(
                    Filter::new()
                        .authors(authors.clone())
                        .kinds(vec![Kind::Metadata, Kind::ContactList, Kind::MuteList])
                        .limit(3000),
                    NegentropyOptions::default(),
                )
                .await
            {
                println!("Received: {}", report.received.len())
            }

            // Fetching contact's events
            if let Ok(report) = client
                .reconcile(
                    Filter::new()
                        .authors(authors.clone())
                        .kinds(vec![Kind::TextNote, Kind::Repost])
                        .limit(1000),
                    NegentropyOptions::default(),
                )
                .await
            {
                println!("Received: {}", report.received.len());

                // Save the process status
                let _ = File::create(config_dir.join(author.to_bech32().unwrap()));
                // Update frontend
                handle.emit("synchronized", ()).unwrap();
            };

            for author in authors.into_iter() {
                let filter = Filter::new()
                    .author(author)
                    .kind(Kind::ContactList)
                    .limit(1);

                let mut circles = state.circles.lock().await;
                let mut list: Vec<PublicKey> = Vec::new();

                if let Ok(events) = client.database().query(vec![filter]).await {
                    if let Some(event) = events.into_iter().next() {
                        for tag in event.tags.into_iter() {
                            if let Some(TagStandard::PublicKey {
                                public_key,
                                uppercase: false,
                                ..
                            }) = tag.to_standardized()
                            {
                                list.push(public_key)
                            }
                        }

                        if !list.is_empty() {
                            circles.insert(author, list);
                        };
                    }
                }
            }
        } else {
            handle.emit("synchronized", ()).unwrap();
        }
    });

    Ok(public_key)
}
