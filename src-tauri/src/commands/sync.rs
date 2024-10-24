use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::str::FromStr;
use tauri::{AppHandle, Manager};
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

        // NEG: Sync metadata
        //
        let metadata = Filter::new().authors(public_keys.clone()).kinds(vec![
            Kind::Metadata,
            Kind::ContactList,
            Kind::Interests,
            Kind::InterestSet,
            Kind::FollowSet,
            Kind::EventDeletion,
            Kind::TextNote,
            Kind::Repost,
            Kind::Custom(30315),
        ]);

        if let Ok(report) = client
            .sync_with(&bootstrap_relays, metadata, NegentropyOptions::default())
            .await
        {
            NegentropyEvent {
                kind: NegentropyKind::Others,
                total_event: report.received.len() as i32,
            }
            .emit(&app_handle)
            .unwrap();
        }

        // NEG: Sync notification
        //
        let notification = Filter::new()
            .pubkeys(public_keys)
            .kinds(vec![
                Kind::TextNote,
                Kind::Repost,
                Kind::Reaction,
                Kind::ZapReceipt,
            ])
            .limit(5000);

        if let Ok(report) = client
            .sync_with(
                &bootstrap_relays,
                notification,
                NegentropyOptions::default(),
            )
            .await
        {
            NegentropyEvent {
                kind: NegentropyKind::Notification,
                total_event: report.received.len() as i32,
            }
            .emit(&app_handle)
            .unwrap();
        }

        // NEG: Sync events for all pubkeys in local database
        //
        let pubkey_filter = Filter::new().kinds(vec![
            Kind::ContactList,
            Kind::Repost,
            Kind::TextNote,
            Kind::FollowSet,
        ]);

        if let Ok(events) = client.database().query(vec![pubkey_filter]).await {
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
                    .limit(5000);

                if let Ok(report) = client
                    .sync_with(&bootstrap_relays, events, NegentropyOptions::default())
                    .await
                {
                    NegentropyEvent {
                        kind: NegentropyKind::Events,
                        total_event: report.received.len() as i32,
                    }
                    .emit(&app_handle)
                    .unwrap();
                }

                // NEG: Sync metadata
                //
                let metadata = Filter::new()
                    .authors(authors)
                    .kinds(vec![Kind::Metadata, Kind::ContactList]);

                if let Ok(report) = client
                    .sync_with(&bootstrap_relays, metadata, NegentropyOptions::default())
                    .await
                {
                    NegentropyEvent {
                        kind: NegentropyKind::Metadata,
                        total_event: report.received.len() as i32,
                    }
                    .emit(&app_handle)
                    .unwrap();
                }
            }
        }
    });
}

pub fn sync_account(public_key: PublicKey, app_handle: AppHandle) {
    tauri::async_runtime::spawn(async move {
        let state = app_handle.state::<Nostr>();
        let client = &state.client;
        let bootstrap_relays = state.bootstrap_relays.lock().unwrap().clone();

        // NEG: Sync all user's metadata
        //
        let metadata = Filter::new().author(public_key).kinds(vec![
            Kind::Metadata,
            Kind::ContactList,
            Kind::Interests,
            Kind::InterestSet,
            Kind::FollowSet,
            Kind::RelayList,
            Kind::RelaySet,
            Kind::EventDeletion,
            Kind::Custom(30315),
        ]);

        if let Ok(report) = client
            .sync_with(&bootstrap_relays, metadata, NegentropyOptions::default())
            .await
        {
            NegentropyEvent {
                kind: NegentropyKind::Metadata,
                total_event: report.received.len() as i32,
            }
            .emit(&app_handle)
            .unwrap();
        }

        if let Ok(contact_list) = client.database().contacts_public_keys(public_key).await {
            // NEG: Sync all contact's metadata
            //
            let metadata = Filter::new()
                .authors(contact_list.clone())
                .kinds(vec![Kind::Metadata, Kind::RelaySet, Kind::Custom(30315)])
                .limit(1000);

            if let Ok(report) = client
                .sync_with(&bootstrap_relays, metadata, NegentropyOptions::default())
                .await
            {
                NegentropyEvent {
                    kind: NegentropyKind::Metadata,
                    total_event: report.received.len() as i32,
                }
                .emit(&app_handle)
                .unwrap();
            }

            // NEG: Sync all contact's events
            //
            let metadata = Filter::new()
                .authors(contact_list.clone())
                .kinds(vec![Kind::TextNote, Kind::Repost])
                .limit(1000);

            if let Ok(report) = client
                .sync_with(&bootstrap_relays, metadata, NegentropyOptions::default())
                .await
            {
                NegentropyEvent {
                    kind: NegentropyKind::Events,
                    total_event: report.received.len() as i32,
                }
                .emit(&app_handle)
                .unwrap();
            }

            // NEG: Sync all contact's other metadata
            //
            let metadata = Filter::new()
                .authors(contact_list)
                .kinds(vec![
                    Kind::Interests,
                    Kind::InterestSet,
                    Kind::FollowSet,
                    Kind::EventDeletion,
                ])
                .limit(1000);

            if let Ok(report) = client
                .sync_with(&bootstrap_relays, metadata, NegentropyOptions::default())
                .await
            {
                NegentropyEvent {
                    kind: NegentropyKind::Metadata,
                    total_event: report.received.len() as i32,
                }
                .emit(&app_handle)
                .unwrap();
            }
        }

        // NEG: Sync all user's metadata
        //
        let notification = Filter::new()
            .pubkey(public_key)
            .kinds(vec![
                Kind::TextNote,
                Kind::Repost,
                Kind::Reaction,
                Kind::ZapReceipt,
            ])
            .limit(500);

        if let Ok(report) = client
            .sync_with(
                &bootstrap_relays,
                notification,
                NegentropyOptions::default(),
            )
            .await
        {
            NegentropyEvent {
                kind: NegentropyKind::Notification,
                total_event: report.received.len() as i32,
            }
            .emit(&app_handle)
            .unwrap();
        }
    });
}
