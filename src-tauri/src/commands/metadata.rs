use keyring::Entry;
use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::{str::FromStr, time::Duration};
use tauri::{Emitter, Manager, State};
use tauri_specta::Event;

use crate::{
    common::{get_latest_event, process_event},
    NewSettings, Nostr, RichEvent, Settings,
};

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

#[derive(Clone, Serialize, Deserialize, Type)]
pub struct Mention {
    pubkey: String,
    avatar: String,
    display_name: String,
    name: String,
}

#[tauri::command]
#[specta::specta]
pub async fn get_profile(id: Option<String>, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;

    let public_key: PublicKey = match id {
        Some(user_id) => PublicKey::parse(&user_id).map_err(|e| e.to_string())?,
        None => {
            let signer = client.signer().await.map_err(|e| e.to_string())?;
            signer.public_key().await.map_err(|e| e.to_string())?
        }
    };

    let filter = Filter::new()
        .author(public_key)
        .kind(Kind::Metadata)
        .limit(1);

    match client.database().query(vec![filter.clone()]).await {
        Ok(events) => {
            if let Some(event) = get_latest_event(&events) {
                if let Ok(metadata) = Metadata::from_json(&event.content) {
                    Ok(metadata.as_json())
                } else {
                    Err("Parse metadata failed".into())
                }
            } else {
                match client
                    .get_events_of(
                        vec![filter],
                        EventSource::relays(Some(Duration::from_secs(10))),
                    )
                    .await
                {
                    Ok(events) => {
                        if let Some(event) = get_latest_event(&events) {
                            if let Ok(metadata) = Metadata::from_json(&event.content) {
                                Ok(metadata.as_json())
                            } else {
                                Err("Metadata is not valid.".into())
                            }
                        } else {
                            Err("Not found.".into())
                        }
                    }
                    Err(e) => Err(e.to_string()),
                }
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

    match client.set_contact_list(contact_list).await {
        Ok(_) => Ok(true),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub fn get_contact_list(state: State<'_, Nostr>) -> Result<Vec<String>, String> {
    let contact_list = state.contact_list.lock().unwrap().clone();
    let vec: Vec<String> = contact_list
        .into_iter()
        .map(|f| f.public_key.to_hex())
        .collect();

    Ok(vec)
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
pub fn check_contact(id: String, state: State<'_, Nostr>) -> Result<bool, String> {
    let contact_list = &state.contact_list.lock().unwrap();
    let public_key = PublicKey::from_str(&id).map_err(|e| e.to_string())?;

    match contact_list.iter().position(|x| x.public_key == public_key) {
        Some(_) => Ok(true),
        None => Ok(false),
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
        .map(|u| PublicKey::from_str(u).unwrap())
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

    match client.send_event_builder(builder).await {
        Ok(report) => {
            tauri::async_runtime::spawn(async move {
                let state = handle.state::<Nostr>();
                let client = &state.client;

                let filter = Filter::new()
                    .kinds(vec![Kind::TextNote, Kind::Repost])
                    .authors(public_keys)
                    .limit(500);

                if let Ok(report) = client.reconcile(filter, NegentropyOptions::default()).await {
                    println!("Received: {}", report.received.len());
                    handle.emit("synchronized", ()).unwrap();
                };
            });

            Ok(report.id().to_hex())
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_group(id: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let event_id = EventId::from_str(&id).map_err(|e| e.to_string())?;
    let filter = Filter::new().kind(Kind::FollowSet).id(event_id);

    match client.database().query(vec![filter]).await {
        Ok(events) => match get_latest_event(&events) {
            Some(ev) => Ok(ev.as_json()),
            None => Err("Not found.".to_string()),
        },
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_groups(state: State<'_, Nostr>) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let signer = client.signer().await.map_err(|e| e.to_string())?;
    let public_key = signer.public_key().await.map_err(|e| e.to_string())?;
    let filter = Filter::new().kind(Kind::FollowSet).author(public_key);

    match client.database().query(vec![filter]).await {
        Ok(events) => Ok(process_event(client, events).await),
        Err(e) => Err(e.to_string()),
    }
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

    match client.send_event_builder(builder).await {
        Ok(report) => {
            tauri::async_runtime::spawn(async move {
                let state = handle.state::<Nostr>();
                let client = &state.client;

                let filter = Filter::new()
                    .kinds(vec![Kind::TextNote, Kind::Repost])
                    .hashtags(hashtags)
                    .limit(500);

                if let Ok(report) = client.reconcile(filter, NegentropyOptions::default()).await {
                    println!("Received: {}", report.received.len());
                    handle.emit("synchronized", ()).unwrap();
                };
            });

            Ok(report.id().to_hex())
        }
        Err(e) => Err(e.to_string()),
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

    match client.database().query(vec![filter]).await {
        Ok(events) => match get_latest_event(&events) {
            Some(ev) => Ok(ev.as_json()),
            None => Err("Not found.".to_string()),
        },
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_interests(state: State<'_, Nostr>) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let signer = client.signer().await.map_err(|e| e.to_string())?;
    let public_key = signer.public_key().await.map_err(|e| e.to_string())?;
    let filter = Filter::new()
        .kinds(vec![Kind::InterestSet, Kind::Interests])
        .author(public_key);

    match client.database().query(vec![filter]).await {
        Ok(events) => Ok(process_event(client, events).await),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_mention_list(state: State<'_, Nostr>) -> Result<Vec<Mention>, String> {
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
pub fn get_user_settings(state: State<'_, Nostr>) -> Result<Settings, String> {
    Ok(state.settings.lock().unwrap().clone())
}

#[tauri::command]
#[specta::specta]
pub async fn set_user_settings(
    settings: String,
    state: State<'_, Nostr>,
    handle: tauri::AppHandle,
) -> Result<(), String> {
    let client = &state.client;
    let tags = vec![Tag::identifier("lume_user_setting")];
    let builder = EventBuilder::new(Kind::ApplicationSpecificData, &settings, tags);

    match client.send_event_builder(builder).await {
        Ok(_) => {
            let parsed: Settings = serde_json::from_str(&settings).map_err(|e| e.to_string())?;

            // Update state
            state.settings.lock().unwrap().clone_from(&parsed);

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

#[tauri::command]
#[specta::specta]
pub fn is_trusted_user(id: String, state: State<'_, Nostr>) -> Result<bool, String> {
    let trusted_list = &state.trusted_list.lock().unwrap();
    let public_key = PublicKey::from_str(&id).map_err(|e| e.to_string())?;

    Ok(trusted_list.contains(&public_key))
}
