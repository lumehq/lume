use nostr_sdk::prelude::*;
use std::collections::HashSet;
use tauri::State;

use crate::Nostr;

#[tauri::command]
#[specta::specta]
pub async fn sync_all(
    state: State<'_, Nostr>,
    reader: tauri::ipc::Channel<f64>,
) -> Result<(), String> {
    let client = &state.client;

    // Create a filter for get all public keys
    let filter = Filter::new().kinds(vec![
        Kind::TextNote,
        Kind::Repost,
        Kind::FollowSet,
        Kind::ContactList,
        Kind::MuteList,
    ]);

    let events = client
        .database()
        .query(vec![filter])
        .await
        .map_err(|err| err.to_string())?;

    let public_keys: Vec<PublicKey> = events
        .iter()
        .flat_map(|ev| ev.tags.public_keys().copied())
        .collect::<HashSet<_>>()
        .into_iter()
        .collect();

    let (tx, mut rx) = SyncProgress::channel();
    let opts = SyncOptions::default().progress(tx);

    tauri::async_runtime::spawn(async move {
        while rx.changed().await.is_ok() {
            let progress = *rx.borrow_and_update();

            if progress.total > 0 {
                reader.send(progress.percentage() * 100.0).unwrap();
            }
        }
    });

    for chunk in public_keys.chunks(200) {
        let authors = chunk.to_owned();
        let filter = Filter::new().authors(authors).kinds(vec![
            Kind::Metadata,
            Kind::ContactList,
            Kind::FollowSet,
            Kind::Interests,
            Kind::InterestSet,
            Kind::EventDeletion,
            Kind::TextNote,
            Kind::Repost,
            Kind::Comment,
        ]);

        let _ = client
            .sync(filter, &opts)
            .await
            .map_err(|err| err.to_string())?;
    }

    Ok(())
}
