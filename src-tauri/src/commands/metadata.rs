use keyring::Entry;
use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::{str::FromStr, time::Duration};
use tauri::State;
use tauri_specta::Event;

use crate::{common::get_latest_event, NewSettings, Nostr, Settings};

#[derive(Clone, Serialize, Deserialize, Type)]
pub struct Profile {
    name: String,
    display_name: String,
    about: Option<String>,
    picture: String,
    banner: Option<String>,
    nip05: Option<String>,
    lud16: Option<String>,
    website: Option<String>,
}

#[tauri::command]
#[specta::specta]
pub async fn get_profile(id: Option<String>, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let public_key: PublicKey = match id {
        Some(user_id) => PublicKey::parse(&user_id).map_err(|e| e.to_string())?,
        None => client.signer().await.unwrap().public_key().await.unwrap(),
    };

    let filter = Filter::new()
        .author(public_key)
        .kind(Kind::Metadata)
        .limit(1);

    match client
        .get_events_of(
            vec![filter],
            EventSource::both(Some(Duration::from_secs(3))),
        )
        .await
    {
        Ok(events) => {
            if let Some(event) = events.first() {
                if let Ok(metadata) = Metadata::from_json(&event.content) {
                    Ok(metadata.as_json())
                } else {
                    Err("Parse metadata failed".into())
                }
            } else {
                Ok(Metadata::new().as_json())
            }
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn set_contact_list(
    public_keys: Vec<String>,
    state: State<'_, Nostr>,
) -> Result<bool, String> {
    let client = &state.client;
    let contact_list: Vec<Contact> = public_keys
        .into_iter()
        .filter_map(|p| match PublicKey::parse(p) {
            Ok(pk) => Some(Contact::new(pk, None, Some(""))),
            Err(_) => None,
        })
        .collect();

    // Update local state
    state.contact_list.lock().await.clone_from(&contact_list);

    match client.set_contact_list(contact_list).await {
        Ok(_) => Ok(true),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_contact_list(state: State<'_, Nostr>) -> Result<Vec<String>, String> {
    let client = &state.client;

    match client.get_contact_list(Some(Duration::from_secs(10))).await {
        Ok(contact_list) => {
            if !contact_list.is_empty() {
                let list = contact_list
                    .into_iter()
                    .map(|f| f.public_key.to_hex())
                    .collect();

                Ok(list)
            } else {
                Err("Empty.".into())
            }
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn set_profile(profile: Profile, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let mut metadata = Metadata::new()
        .name(profile.name)
        .display_name(profile.display_name)
        .about(profile.about.unwrap_or_default())
        .nip05(profile.nip05.unwrap_or_default())
        .lud16(profile.lud16.unwrap_or_default());

    if let Ok(url) = Url::parse(&profile.picture) {
        metadata = metadata.picture(url)
    }

    if let Some(b) = profile.banner {
        if let Ok(url) = Url::parse(&b) {
            metadata = metadata.banner(url)
        }
    }

    if let Some(w) = profile.website {
        if let Ok(url) = Url::parse(&w) {
            metadata = metadata.website(url)
        }
    }

    match client.set_metadata(&metadata).await {
        Ok(id) => Ok(id.to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn is_contact_list_empty(state: State<'_, Nostr>) -> Result<bool, ()> {
    Ok(state.contact_list.lock().await.is_empty())
}

#[tauri::command]
#[specta::specta]
pub async fn check_contact(hex: String, state: State<'_, Nostr>) -> Result<bool, String> {
    let contact_list = state.contact_list.lock().await;

    match PublicKey::parse(&hex) {
        Ok(public_key) => match contact_list.iter().position(|x| x.public_key == public_key) {
            Some(_) => Ok(true),
            None => Ok(false),
        },
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn toggle_contact(
    id: String,
    alias: Option<String>,
    state: State<'_, Nostr>,
) -> Result<String, String> {
    let client = &state.client;

    match client.get_contact_list(Some(Duration::from_secs(5))).await {
        Ok(mut contact_list) => {
            let public_key = PublicKey::parse(&id).map_err(|e| e.to_string())?;

            match contact_list.iter().position(|x| x.public_key == public_key) {
                Some(index) => {
                    // Remove contact
                    contact_list.remove(index);
                }
                None => {
                    // TODO: Add relay_url
                    let new_contact = Contact::new(public_key, None, alias);
                    // Add new contact
                    contact_list.push(new_contact);
                }
            }

            // Update local state
            state.contact_list.lock().await.clone_from(&contact_list);

            // Publish
            match client.set_contact_list(contact_list).await {
                Ok(event_id) => Ok(event_id.to_string()),
                Err(err) => Err(err.to_string()),
            }
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn set_lume_store(
    key: String,
    content: String,
    state: State<'_, Nostr>,
) -> Result<String, String> {
    let client = &state.client;
    let signer = client.signer().await.map_err(|e| e.to_string())?;
    let public_key = signer.public_key().await.map_err(|e| e.to_string())?;

    let encrypted = signer
        .nip44_encrypt(&public_key, content)
        .await
        .map_err(|e| e.to_string())?;
    let tag = Tag::identifier(key);
    let builder = EventBuilder::new(Kind::ApplicationSpecificData, encrypted, vec![tag]);

    match client.send_event_builder(builder).await {
        Ok(event_id) => Ok(event_id.to_string()),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_lume_store(key: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let signer = client.signer().await.map_err(|e| e.to_string())?;
    let public_key = signer.public_key().await.map_err(|e| e.to_string())?;

    let filter = Filter::new()
        .author(public_key)
        .kind(Kind::ApplicationSpecificData)
        .identifier(key)
        .limit(10);

    match client
        .get_events_of(vec![filter], EventSource::Database)
        .await
    {
        Ok(events) => {
            if let Some(event) = get_latest_event(&events) {
                match signer.nip44_decrypt(&public_key, &event.content).await {
                    Ok(decrypted) => Ok(decrypted),
                    Err(_) => Err(event.content.to_string()),
                }
            } else {
                Err("Not found".into())
            }
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn set_wallet(uri: &str, state: State<'_, Nostr>) -> Result<bool, String> {
    let client = &state.client;

    if let Ok(nwc_uri) = NostrWalletConnectURI::from_str(uri) {
        let nwc = NWC::new(nwc_uri);
        let keyring = Entry::new("Lume Secret", "Bitcoin Connect").map_err(|e| e.to_string())?;
        keyring.set_password(uri).map_err(|e| e.to_string())?;
        client.set_zapper(nwc).await;

        Ok(true)
    } else {
        Err("Set NWC failed".into())
    }
}

#[tauri::command]
#[specta::specta]
pub async fn load_wallet(state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let keyring =
        Entry::new("Lume Secret Storage", "Bitcoin Connect").map_err(|e| e.to_string())?;

    match keyring.get_password() {
        Ok(val) => {
            let uri = NostrWalletConnectURI::from_str(&val).unwrap();
            let nwc = NWC::new(uri);

            // Get current balance
            let balance = nwc.get_balance().await;

            // Update zapper
            client.set_zapper(nwc).await;

            match balance {
                Ok(val) => Ok(val.to_string()),
                Err(_) => Err("Get balance failed.".into()),
            }
        }
        Err(_) => Err("NWC not found.".into()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn remove_wallet(state: State<'_, Nostr>) -> Result<(), String> {
    let client = &state.client;
    let keyring =
        Entry::new("Lume Secret Storage", "Bitcoin Connect").map_err(|e| e.to_string())?;

    match keyring.delete_credential() {
        Ok(_) => {
            client.unset_zapper().await;
            Ok(())
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn zap_profile(
    id: &str,
    amount: &str,
    message: &str,
    state: State<'_, Nostr>,
) -> Result<bool, String> {
    let client = &state.client;
    let public_key: PublicKey = PublicKey::parse(id).map_err(|e| e.to_string())?;

    let details = ZapDetails::new(ZapType::Private).message(message);
    let num = amount.parse::<u64>().map_err(|e| e.to_string())?;

    if client.zap(public_key, num, Some(details)).await.is_ok() {
        Ok(true)
    } else {
        Err("Zap profile failed".into())
    }
}

#[tauri::command]
#[specta::specta]
pub async fn zap_event(
    id: &str,
    amount: &str,
    message: &str,
    state: State<'_, Nostr>,
) -> Result<bool, String> {
    let client = &state.client;
    let event_id = match Nip19::from_bech32(id) {
        Ok(val) => match val {
            Nip19::EventId(id) => id,
            Nip19::Event(event) => event.event_id,
            _ => return Err("Event ID is invalid.".into()),
        },
        Err(_) => match EventId::from_hex(id) {
            Ok(val) => val,
            Err(_) => return Err("Event ID is invalid.".into()),
        },
    };

    let details = ZapDetails::new(ZapType::Private).message(message);
    let num = amount.parse::<u64>().map_err(|e| e.to_string())?;

    if client.zap(event_id, num, Some(details)).await.is_ok() {
        Ok(true)
    } else {
        Err("Zap event failed".into())
    }
}

#[tauri::command]
#[specta::specta]
pub async fn copy_friend(npub: &str, state: State<'_, Nostr>) -> Result<bool, String> {
    let client = &state.client;

    match PublicKey::from_bech32(npub) {
        Ok(author) => {
            let mut contact_list: Vec<Contact> = Vec::new();
            let contact_list_filter = Filter::new()
                .author(author)
                .kind(Kind::ContactList)
                .limit(1);

            if let Ok(contact_list_events) = client
                .get_events_of(
                    vec![contact_list_filter],
                    EventSource::both(Some(Duration::from_secs(5))),
                )
                .await
            {
                for event in contact_list_events.into_iter() {
                    for tag in event.tags.into_iter() {
                        if let Some(TagStandard::PublicKey {
                            public_key,
                            relay_url,
                            alias,
                            uppercase: false,
                        }) = tag.to_standardized()
                        {
                            contact_list.push(Contact::new(public_key, relay_url, alias))
                        }
                    }
                }
            }

            match client.set_contact_list(contact_list).await {
                Ok(_) => Ok(true),
                Err(err) => Err(err.to_string()),
            }
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_notifications(state: State<'_, Nostr>) -> Result<Vec<String>, String> {
    let client = &state.client;

    match client.signer().await {
        Ok(signer) => {
            let public_key = signer.public_key().await.unwrap();
            let filter = Filter::new()
                .pubkey(public_key)
                .kinds(vec![
                    Kind::TextNote,
                    Kind::Repost,
                    Kind::Reaction,
                    Kind::ZapReceipt,
                ])
                .limit(200);

            match client.database().query(vec![filter]).await {
                Ok(events) => Ok(events.into_iter().map(|ev| ev.as_json()).collect()),
                Err(err) => Err(err.to_string()),
            }
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_settings(state: State<'_, Nostr>) -> Result<Settings, ()> {
    Ok(state.settings.lock().await.clone())
}

#[tauri::command]
#[specta::specta]
pub async fn set_settings(
    settings: &str,
    state: State<'_, Nostr>,
    handle: tauri::AppHandle,
) -> Result<(), String> {
    let client = &state.client;
    let ident = "lume_v4:settings";
    let signer = client.signer().await.map_err(|e| e.to_string())?;
    let public_key = signer.public_key().await.map_err(|e| e.to_string())?;
    let encrypted = signer
        .nip44_encrypt(&public_key, settings)
        .await
        .map_err(|e| e.to_string())?;
    let tag = Tag::identifier(ident);
    let builder = EventBuilder::new(Kind::ApplicationSpecificData, encrypted, vec![tag]);

    match client.send_event_builder(builder).await {
        Ok(_) => {
            let parsed: Settings = serde_json::from_str(settings).map_err(|e| e.to_string())?;

            // Update state
            state.settings.lock().await.clone_from(&parsed);

            // Emit new changes to frontend
            NewSettings(parsed).emit(&handle).unwrap();

            Ok(())
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn verify_nip05(id: String, nip05: &str) -> Result<bool, String> {
    match PublicKey::from_str(&id) {
        Ok(public_key) => match nip05::verify(&public_key, nip05, None).await {
            Ok(status) => Ok(status),
            Err(e) => Err(e.to_string()),
        },
        Err(e) => Err(e.to_string()),
    }
}
