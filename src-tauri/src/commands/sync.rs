use nostr_sdk::prelude::*;
use std::fs::{self, File};
use tauri::{ipc::Channel, Manager, State};

use crate::Nostr;

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

    if let Ok(output) = client.sync(filter, &opts).await {
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

            if let Ok(output) = client.sync(filter, &opts).await {
                println!("Success: {:?}", output.success);
                println!("Failed: {:?}", output.failed);
            }
        };
    }

    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| e.to_string())?;
    let _ = File::create(config_dir.join(id));

    Ok(())
}
