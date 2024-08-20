use keyring::Entry;
use keyring_search::{Limit, List, Search};
use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::{collections::HashSet, str::FromStr, time::Duration};
use tauri::{Emitter, Manager, State};
use tauri_plugin_notification::NotificationExt;

use crate::{
    common::{get_user_settings, init_nip65, parse_event},
    Nostr, RichEvent, NEWSFEED_NEG_LIMIT, NOTIFICATION_NEG_LIMIT,
};

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
    let secret_key = keys.secret_key().map_err(|e| e.to_string())?;
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
pub async fn import_account(
    key: String,
    password: Option<String>,
    state: State<'_, Nostr>,
) -> Result<String, String> {
    let client = &state.client;
    let secret_key = SecretKey::from_bech32(key).map_err(|err| err.to_string())?;
    let keys = Keys::new(secret_key.clone());
    let npub = keys.public_key().to_bech32().unwrap();

    let enc_bech32 = match password {
        Some(pw) => {
            let enc = EncryptedSecretKey::new(&secret_key, pw, 16, KeySecurity::Medium)
                .map_err(|err| err.to_string())?;

            enc.to_bech32().map_err(|err| err.to_string())?
        }
        None => secret_key.to_bech32().map_err(|err| err.to_string())?,
    };

    let keyring = Entry::new("Lume Secret Storage", &npub).map_err(|e| e.to_string())?;
    let account = Account {
        password: enc_bech32,
        nostr_connect: None,
    };
    let j = serde_json::to_string(&account).map_err(|e| e.to_string())?;
    let _ = keyring.set_password(&j);

    let signer = NostrSigner::Keys(keys);

    // Update client's signer
    client.set_signer(Some(signer)).await;

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
            let app_secret = app_keys.secret_key().unwrap().to_string();

            // Get remote user
            let remote_user = bunker_uri.signer_public_key().unwrap();
            let remote_npub = remote_user.to_bech32().unwrap();

            match Nip46Signer::new(bunker_uri, app_keys, Duration::from_secs(120), None).await {
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
pub fn delete_account(id: String) -> Result<(), String> {
    let keyring = Entry::new("Lume Secret Storage", &id).map_err(|e| e.to_string())?;
    let _ = keyring.delete_credential();

    Ok(())
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

            match Nip46Signer::new(uri, app_keys, Duration::from_secs(120), None).await {
                Ok(signer) => {
                    // Update signer
                    client.set_signer(Some(signer.into())).await;
                    public_key
                }
                Err(e) => return Err(e.to_string()),
            }
        }
    };

    // Connect to user's relay (NIP-65)
    init_nip65(client).await;

    // Get user's contact list
    if let Ok(contacts) = client.get_contact_list(Some(Duration::from_secs(5))).await {
        let mut contacts_state = state.contact_list.lock().await;
        *contacts_state = contacts;
    };

    // Get user's settings
    if let Ok(settings) = get_user_settings(client).await {
        let mut settings_state = state.settings.lock().await;
        *settings_state = settings;
    };

    tauri::async_runtime::spawn(async move {
        let state = handle.state::<Nostr>();
        let client = &state.client;
        let contact_list = state.contact_list.lock().await;

        let signer = client.signer().await.unwrap();
        let public_key = signer.public_key().await.unwrap();

        let local_id = SubscriptionId::new("local");
        let notification_id = SubscriptionId::new("notification");

        if !contact_list.is_empty() {
            let authors: Vec<PublicKey> = contact_list.iter().map(|f| f.public_key).collect();

            let sync = Filter::new()
                .authors(authors.clone())
                .kinds(vec![Kind::TextNote, Kind::Repost])
                .limit(NEWSFEED_NEG_LIMIT);

            match client.reconcile(sync, NegentropyOptions::default()).await {
                Ok(_) => {
                    if handle.emit("newsfeed_synchronized", ()).is_err() {
                        println!("Failed.")
                    }
                }
                Err(_) => println!("Failed."),
            };

            let local = Filter::new()
                .kinds(vec![Kind::TextNote, Kind::Repost])
                .authors(authors)
                .since(Timestamp::now());

            if client
                .subscribe_with_id(local_id.clone(), vec![local], None)
                .await
                .is_ok()
            {
                println!("Subscribing for local events")
            }
        };

        drop(contact_list);

        let sync = Filter::new()
            .pubkey(public_key)
            .kinds(vec![
                Kind::TextNote,
                Kind::Repost,
                Kind::Reaction,
                Kind::ZapReceipt,
            ])
            .limit(NOTIFICATION_NEG_LIMIT);

        match client.reconcile(sync, NegentropyOptions::default()).await {
            Ok(_) => {
                if handle.emit("notification_synchronized", ()).is_err() {
                    println!("Failed.")
                }
            }
            Err(_) => println!("Failed."),
        };

        let notification = Filter::new()
            .pubkey(public_key)
            .kinds(vec![
                Kind::TextNote,
                Kind::Repost,
                Kind::Reaction,
                Kind::ZapReceipt,
            ])
            .since(Timestamp::now());

        // Subscribing for new notification...
        if client
            .subscribe_with_id(notification_id.clone(), vec![notification], None)
            .await
            .is_ok()
        {
            println!("Subscribing for notification")
        }

        // Handle notifications
        client
            .handle_notifications(|notification| async {
                if let RelayPoolNotification::Message { message, .. } = notification {
                    if let RelayMessage::Event {
                        subscription_id,
                        event,
                    } = message
                    {
                        if subscription_id == notification_id {
                            let author = client
                                .metadata(event.pubkey)
                                .await
                                .unwrap_or_else(|_| Metadata::new());

                            match event.kind() {
                                Kind::TextNote => {
                                    if let Err(e) = handle
                                        .notification()
                                        .builder()
                                        .body("Mentioned you in a thread.")
                                        .title(
                                            author
                                                .display_name
                                                .unwrap_or_else(|| "Lume".to_string()),
                                        )
                                        .show()
                                    {
                                        println!("Error: {}", e);
                                    }
                                }
                                Kind::Repost => {
                                    if let Err(e) = handle
                                        .notification()
                                        .builder()
                                        .body("Reposted your note.")
                                        .title(
                                            author
                                                .display_name
                                                .unwrap_or_else(|| "Lume".to_string()),
                                        )
                                        .show()
                                    {
                                        println!("Error: {}", e);
                                    }
                                }
                                Kind::ZapReceipt => {
                                    if let Err(e) = handle
                                        .notification()
                                        .builder()
                                        .body("Zapped you.")
                                        .title(
                                            author
                                                .display_name
                                                .unwrap_or_else(|| "Lume".to_string()),
                                        )
                                        .show()
                                    {
                                        println!("Error: {}", e);
                                    }
                                }
                                _ => {}
                            }
                        } else if subscription_id == local_id {
                            let raw = event.as_json();
                            let parsed = if event.kind == Kind::TextNote {
                                Some(parse_event(&event.content).await)
                            } else {
                                None
                            };

                            handle
                                .emit("local_event", RichEvent { raw, parsed })
                                .unwrap();
                        }
                    } else {
                        println!("new message: {}", message.as_json())
                    }
                }
                Ok(false)
            })
            .await
    });

    Ok(public_key)
}
