use keyring::Entry;
use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::{str::FromStr, time::Duration};
use tauri::{Emitter, Manager, State};

use crate::{
    common::{get_latest_event, process_event},
    Nostr, RichEvent,
};

#[derive(Clone, Serialize, Deserialize, Type)]
pub struct Mention {
    pubkey: String,
    avatar: String,
    display_name: String,
    name: String,
}

#[tauri::command]
#[specta::specta]
pub async fn get_profile(id: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let public_key = PublicKey::parse(&id).map_err(|e| e.to_string())?;

    let filter = Filter::new()
        .author(public_key)
        .kind(Kind::Metadata)
        .limit(1);

    let events = client
        .database()
        .query(vec![filter])
        .await
        .map_err(|e| e.to_string())?;

    match events.first() {
        Some(event) => match Metadata::from_json(&event.content) {
            Ok(metadata) => Ok(metadata.as_json()),
            Err(e) => Err(e.to_string()),
        },
        None => Err("Metadata not found".into()),
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

    match client.set_contact_list(contact_list).await {
        Ok(_) => Ok(true),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_contact_list(id: String, state: State<'_, Nostr>) -> Result<Vec<String>, String> {
    let client = &state.client;
    let public_key = PublicKey::parse(&id).map_err(|e| e.to_string())?;

    let filter = Filter::new()
        .author(public_key)
        .kind(Kind::ContactList)
        .limit(1);

    let mut contact_list: Vec<String> = Vec::new();

    match client
        .fetch_events(vec![filter], Some(Duration::from_secs(3)))
        .await
    {
        Ok(events) => {
            if let Some(event) = events.into_iter().next() {
                for tag in event.tags.into_iter() {
                    if let Some(TagStandard::PublicKey {
                        public_key,
                        uppercase: false,
                        ..
                    }) = tag.to_standardized()
                    {
                        contact_list.push(public_key.to_hex())
                    }
                }
            }

            Ok(contact_list)
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn set_profile(new_profile: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let metadata = Metadata::from_json(new_profile).map_err(|e| e.to_string())?;

    match client.set_metadata(&metadata).await {
        Ok(id) => Ok(id.to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn is_contact(id: String, state: State<'_, Nostr>) -> Result<bool, String> {
    let client = &state.client;
    let public_key = PublicKey::parse(&id).map_err(|e| e.to_string())?;

    let filter = Filter::new()
        .author(public_key)
        .kind(Kind::ContactList)
        .limit(1);

    match client.database().query(vec![filter]).await {
        Ok(events) => {
            if let Some(event) = events.into_iter().next() {
                let pubkeys = event.tags.public_keys().collect::<Vec<_>>();
                Ok(pubkeys.iter().any(|&i| i == &public_key))
            } else {
                Ok(false)
            }
        }
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
pub async fn set_group(
    title: String,
    description: Option<String>,
    image: Option<String>,
    users: Vec<String>,
    state: State<'_, Nostr>,
    handle: tauri::AppHandle,
) -> Result<String, String> {
    let client = &state.client;
    let public_keys: Vec<PublicKey> = users
        .iter()
        .filter_map(|u| {
            if let Ok(pk) = PublicKey::from_str(u) {
                Some(pk)
            } else {
                None
            }
        })
        .collect();
    let label = title.to_lowercase().replace(" ", "-");
    let mut tags: Vec<Tag> = vec![Tag::title(title)];

    if let Some(desc) = description {
        tags.push(Tag::description(desc))
    };

    if let Some(img) = image {
        let url = UncheckedUrl::new(img);
        tags.push(Tag::image(url, None));
    }

    let builder = EventBuilder::follow_set(label, public_keys.clone()).add_tags(tags);

    // Sign event
    let event = client
        .sign_event_builder(builder)
        .await
        .map_err(|err| err.to_string())?;

    match client.send_event(event).await {
        Ok(output) => {
            // Sync event
            tauri::async_runtime::spawn(async move {
                let state = handle.state::<Nostr>();
                let client = &state.client;

                let filter = Filter::new()
                    .kinds(vec![Kind::TextNote, Kind::Repost])
                    .authors(public_keys)
                    .limit(500);

                if let Ok(report) = client.sync(filter, &SyncOptions::default()).await {
                    println!("Received: {}", report.received.len());
                    handle.emit("synchronized", ()).unwrap();
                };
            });

            Ok(output.to_hex())
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_group(id: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let event_id = EventId::from_str(&id).map_err(|e| e.to_string())?;
    let filter = Filter::new().kind(Kind::FollowSet).id(event_id);

    match client
        .fetch_events(vec![filter], Some(Duration::from_secs(3)))
        .await
    {
        Ok(events) => match get_latest_event(&events) {
            Some(ev) => Ok(ev.as_json()),
            None => Err("Not found.".to_string()),
        },
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_newsfeeds(
    id: String,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let public_key = PublicKey::parse(&id).map_err(|e| e.to_string())?;

    let groups = Filter::new().kind(Kind::FollowSet).author(public_key);
    let contacts = Filter::new()
        .kind(Kind::ContactList)
        .author(public_key)
        .limit(1);

    let remote_events = client
        .fetch_events(vec![groups], Some(Duration::from_secs(3)))
        .await
        .map_err(|e| e.to_string())?;

    let contact_events = client
        .fetch_events(vec![contacts], Some(Duration::from_secs(3)))
        .await
        .map_err(|e| e.to_string())?;

    let events = remote_events.merge(contact_events);
    let alt_events = process_event(client, events, false).await;

    Ok(alt_events)
}

#[tauri::command]
#[specta::specta]
pub async fn set_interest(
    title: String,
    description: Option<String>,
    image: Option<String>,
    hashtags: Vec<String>,
    state: State<'_, Nostr>,
    handle: tauri::AppHandle,
) -> Result<String, String> {
    let client = &state.client;
    let label = title.to_lowercase().replace(" ", "-");
    let mut tags: Vec<Tag> = vec![Tag::title(title)];

    if let Some(desc) = description {
        tags.push(Tag::description(desc))
    };

    if let Some(img) = image {
        let url = UncheckedUrl::new(img);
        tags.push(Tag::image(url, None));
    }

    let builder = EventBuilder::interest_set(label, hashtags.clone()).add_tags(tags);

    // Sign event
    let event = client
        .sign_event_builder(builder)
        .await
        .map_err(|err| err.to_string())?;

    match client.send_event(event).await {
        Ok(output) => {
            // Sync event
            tauri::async_runtime::spawn(async move {
                let state = handle.state::<Nostr>();
                let client = &state.client;

                let filter = Filter::new()
                    .kinds(vec![Kind::TextNote, Kind::Repost])
                    .hashtags(hashtags)
                    .limit(500);

                if let Ok(report) = client.sync(filter, &SyncOptions::default()).await {
                    println!("Received: {}", report.received.len());
                    handle.emit("synchronized", ()).unwrap();
                };
            });

            Ok(output.to_hex())
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_interest(id: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let event_id = EventId::from_str(&id).map_err(|e| e.to_string())?;
    let filter = Filter::new()
        .kinds(vec![Kind::Interests, Kind::InterestSet])
        .id(event_id);

    match client
        .fetch_events(vec![filter], Some(Duration::from_secs(3)))
        .await
    {
        Ok(events) => match get_latest_event(&events) {
            Some(ev) => Ok(ev.as_json()),
            None => Err("Not found.".to_string()),
        },
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_interests(
    id: String,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let public_key = PublicKey::parse(&id).map_err(|e| e.to_string())?;
    let filter = Filter::new()
        .kinds(vec![Kind::InterestSet, Kind::Interests])
        .author(public_key);

    match client
        .fetch_events(vec![filter], Some(Duration::from_secs(3)))
        .await
    {
        Ok(events) => Ok(process_event(client, events, false).await),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_profiles(state: State<'_, Nostr>) -> Result<Vec<Mention>, String> {
    let client = &state.client;
    let filter = Filter::new().kind(Kind::Metadata);

    let events = client
        .database()
        .query(vec![filter])
        .await
        .map_err(|e| e.to_string())?;

    let data: Vec<Mention> = events
        .iter()
        .map(|event| {
            let pubkey = event.pubkey.to_bech32().unwrap();
            let metadata = Metadata::from_json(&event.content).unwrap_or(Metadata::new());

            Mention {
                pubkey,
                avatar: metadata.picture.unwrap_or_else(|| "".to_string()),
                display_name: metadata.display_name.unwrap_or_else(|| "".to_string()),
                name: metadata.name.unwrap_or_else(|| "".to_string()),
            }
        })
        .collect();

    Ok(data)
}

#[tauri::command]
#[specta::specta]
pub async fn set_wallet(uri: &str, state: State<'_, Nostr>) -> Result<bool, String> {
    let client = &state.client;

    if let Ok(nwc_uri) = NostrWalletConnectURI::from_str(uri) {
        let nwc = NWC::new(nwc_uri);
        let keyring =
            Entry::new("Lume Safe Storage", "Bitcoin Connect").map_err(|e| e.to_string())?;

        keyring.set_password(uri).map_err(|e| e.to_string())?;
        client.set_zapper(nwc).await;

        Ok(true)
    } else {
        Err("Set NWC failed".into())
    }
}

#[tauri::command]
#[specta::specta]
pub async fn load_wallet(state: State<'_, Nostr>) -> Result<(), String> {
    let client = &state.client;

    if client.zapper().await.is_err() {
        let keyring =
            Entry::new("Lume Safe Storage", "Bitcoin Connect").map_err(|e| e.to_string())?;

        match keyring.get_password() {
            Ok(val) => {
                let uri = NostrWalletConnectURI::from_str(&val).unwrap();
                let nwc = NWC::new(uri);

                client.set_zapper(nwc).await;
            }
            Err(_) => return Err("Wallet not found.".into()),
        }
    }

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn remove_wallet(state: State<'_, Nostr>) -> Result<(), String> {
    let client = &state.client;
    let keyring = Entry::new("Lume Safe Storage", "Bitcoin Connect").map_err(|e| e.to_string())?;

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
    id: String,
    amount: String,
    message: Option<String>,
    state: State<'_, Nostr>,
) -> Result<(), String> {
    let client = &state.client;

    let public_key: PublicKey = PublicKey::parse(id).map_err(|e| e.to_string())?;
    let num = amount.parse::<u64>().map_err(|e| e.to_string())?;
    let details = message.map(|m| ZapDetails::new(ZapType::Public).message(m));

    match client.zap(public_key, num, details).await {
        Ok(()) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn zap_event(
    id: String,
    amount: String,
    message: Option<String>,
    state: State<'_, Nostr>,
) -> Result<(), String> {
    let client = &state.client;

    let event_id = EventId::from_str(&id).map_err(|e| e.to_string())?;
    let num = amount.parse::<u64>().map_err(|e| e.to_string())?;
    let details = message.map(|m| ZapDetails::new(ZapType::Public).message(m));

    match client.zap(event_id, num, details).await {
        Ok(()) => Ok(()),
        Err(e) => Err(e.to_string()),
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
                .fetch_events(vec![contact_list_filter], Some(Duration::from_secs(5)))
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
pub async fn get_notifications(id: String, state: State<'_, Nostr>) -> Result<Vec<String>, String> {
    let client = &state.client;
    let public_key = PublicKey::from_str(&id).map_err(|e| e.to_string())?;

    let filter = Filter::new()
        .pubkey(public_key)
        .kinds(vec![
            Kind::TextNote,
            Kind::Repost,
            Kind::Reaction,
            Kind::ZapReceipt,
        ])
        .limit(500);

    match client
        .fetch_events(vec![filter], Some(Duration::from_secs(5)))
        .await
    {
        Ok(events) => Ok(events.into_iter().map(|ev| ev.as_json()).collect()),
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
