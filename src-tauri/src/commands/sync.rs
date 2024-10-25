use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::{
    fs::{self, File},
    str::FromStr,
};
use tauri::{ipc::Channel, AppHandle, Manager, State};
use tauri_specta::Event as TauriEvent;

use crate::Nostr;

#[derive(Clone, Serialize, Type, TauriEvent)]
pub struct NegentropyEvent {
    kind: NegentropyKind,
    total_event: i32,
}

#[derive(Clone, Serialize, Deserialize, Type)]
pub enum NegentropyKind {
    Profile,
    Metadata,
    Events,
    EventIds,
    Global,
    Notification,
    Others,
}

pub fn sync_all(accounts: Vec<String>, app_handle: AppHandle) {
    if accounts.is_empty() {
        return;
    };

    let public_keys: Vec<PublicKey> = accounts
        .iter()
        .filter_map(|acc| {
            if let Ok(pk) = PublicKey::from_str(acc) {
                Some(pk)
            } else {
                None
            }
        })
        .collect();

    tauri::async_runtime::spawn(async move {
        let state = app_handle.state::<Nostr>();
        let client = &state.client;
        let bootstrap_relays = state.bootstrap_relays.lock().unwrap().clone();

        // NEG: Sync events for all pubkeys in local database
        //
        if let Ok(events) = client
            .database()
            .query(vec![Filter::new().kinds(vec![
                Kind::ContactList,
                Kind::FollowSet,
                Kind::MuteList,
                Kind::Repost,
                Kind::TextNote,
            ])])
            .await
        {
            let pubkeys: Vec<PublicKey> = events
                .iter()
                .flat_map(|ev| ev.tags.public_keys().copied())
                .collect();

            for chunk in pubkeys.chunks(500) {
                if chunk.is_empty() {
                    break;
                }

                let authors = chunk.to_owned();

                // NEG: Sync event
                //
                let events = Filter::new()
                    .authors(authors.clone())
                    .kinds(vec![Kind::TextNote, Kind::Repost])
                    .limit(1000);

                if let Ok(output) = client
                    .sync_with(&bootstrap_relays, events, SyncOptions::default())
                    .await
                {
                    NegentropyEvent {
                        kind: NegentropyKind::Events,
                        total_event: output.received.len() as i32,
                    }
                    .emit(&app_handle)
                    .unwrap();
                }

                // NEG: Sync metadata
                //
                let metadata = Filter::new()
                    .authors(authors)
                    .kinds(vec![
                        Kind::Metadata,
                        Kind::ContactList,
                        Kind::Interests,
                        Kind::InterestSet,
                        Kind::FollowSet,
                        Kind::MuteList,
                        Kind::RelaySet,
                    ])
                    .limit(1000);

                if let Ok(output) = client
                    .sync_with(&bootstrap_relays, metadata, SyncOptions::default())
                    .await
                {
                    NegentropyEvent {
                        kind: NegentropyKind::Metadata,
                        total_event: output.received.len() as i32,
                    }
                    .emit(&app_handle)
                    .unwrap();
                }
            }
        }

        // NEG: Sync notification
        //
        let notification = Filter::new()
            .pubkeys(public_keys.clone())
            .kinds(vec![
                Kind::TextNote,
                Kind::Repost,
                Kind::Reaction,
                Kind::ZapReceipt,
            ])
            .limit(500);

        if let Ok(output) = client
            .sync_with(&bootstrap_relays, notification, SyncOptions::default())
            .await
        {
            NegentropyEvent {
                kind: NegentropyKind::Notification,
                total_event: output.received.len() as i32,
            }
            .emit(&app_handle)
            .unwrap();
        }

        // NEG: Sync metadata
        //
        let metadata = Filter::new().authors(public_keys.clone()).kinds(vec![
            Kind::Metadata,
            Kind::ContactList,
            Kind::Interests,
            Kind::InterestSet,
            Kind::FollowSet,
            Kind::RelayList,
            Kind::MuteList,
            Kind::EventDeletion,
            Kind::Bookmarks,
            Kind::BookmarkSet,
            Kind::Emojis,
            Kind::EmojiSet,
            Kind::TextNote,
            Kind::Repost,
            Kind::Custom(30315),
        ]);

        if let Ok(output) = client
            .sync_with(&bootstrap_relays, metadata, SyncOptions::default())
            .await
        {
            NegentropyEvent {
                kind: NegentropyKind::Others,
                total_event: output.received.len() as i32,
            }
            .emit(&app_handle)
            .unwrap();
        }
    });
}

#[tauri::command]
#[specta::specta]
pub fn is_account_sync(id: String, app_handle: tauri::AppHandle) -> Result<bool, String> {
    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| e.to_string())?;
    let exist = fs::metadata(config_dir.join(id)).is_ok();

    Ok(exist)
}

#[tauri::command]
#[specta::specta]
pub async fn sync_account(
    id: String,
    state: State<'_, Nostr>,
    reader: Channel<f64>,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let client = &state.client;
    let bootstrap_relays = state.bootstrap_relays.lock().unwrap().clone();

    let public_key = PublicKey::from_bech32(&id).map_err(|e| e.to_string())?;

    let filter = Filter::new().author(public_key).kinds(vec![
        Kind::Metadata,
        Kind::ContactList,
        Kind::Interests,
        Kind::InterestSet,
        Kind::FollowSet,
        Kind::RelayList,
        Kind::MuteList,
        Kind::EventDeletion,
        Kind::Bookmarks,
        Kind::BookmarkSet,
        Kind::TextNote,
        Kind::Repost,
        Kind::Custom(30315),
    ]);

    let (tx, mut rx) = SyncProgress::channel();
    let opts = SyncOptions::default().progress(tx);

    tauri::async_runtime::spawn(async move {
        while (rx.changed().await).is_ok() {
            let SyncProgress { total, current } = *rx.borrow_and_update();

            if total > 0 {
                reader
                    .send((current as f64 / total as f64) * 100.0)
                    .unwrap()
            }
        }
    });

    if let Ok(output) = client
        .sync_with(&bootstrap_relays, filter, opts.clone())
        .await
    {
        println!("Success: {:?}", output.success);
        println!("Failed: {:?}", output.failed);

        let event_pubkeys = client
            .database()
            .query(vec![Filter::new().kinds(vec![
                Kind::ContactList,
                Kind::FollowSet,
                Kind::MuteList,
                Kind::Repost,
                Kind::TextNote,
            ])])
            .await
            .map_err(|e| e.to_string())?;

        if !event_pubkeys.is_empty() {
            let pubkeys: Vec<PublicKey> = event_pubkeys
                .iter()
                .flat_map(|ev| ev.tags.public_keys().copied())
                .collect();

            let filter = Filter::new()
                .authors(pubkeys)
                .kinds(vec![
                    Kind::Metadata,
                    Kind::TextNote,
                    Kind::Repost,
                    Kind::EventDeletion,
                    Kind::Interests,
                    Kind::InterestSet,
                    Kind::FollowSet,
                    Kind::RelayList,
                    Kind::MuteList,
                    Kind::EventDeletion,
                    Kind::Bookmarks,
                    Kind::BookmarkSet,
                    Kind::Custom(30315),
                ])
                .limit(10000);

            if let Ok(output) = client
                .sync_with(&bootstrap_relays, filter, opts.clone())
                .await
            {
                println!("Success: {:?}", output.success);
                println!("Failed: {:?}", output.failed);
            }
        };
    }

    let event_ids = client
        .database()
        .query(vec![Filter::new().kinds(vec![
            Kind::TextNote,
            Kind::Repost,
            Kind::Bookmarks,
            Kind::BookmarkSet,
        ])])
        .await
        .map_err(|e| e.to_string())?;

    if !event_ids.is_empty() {
        let ids: Vec<EventId> = event_ids.iter().map(|ev| ev.id).collect();
        let filter = Filter::new().events(ids);

        if let Ok(output) = client.sync_with(&bootstrap_relays, filter, opts).await {
            println!("Success: {:?}", output.success);
            println!("Failed: {:?}", output.failed);
        }
    }

    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| e.to_string())?;
    let _ = File::create(config_dir.join(id));

    Ok(())
}
