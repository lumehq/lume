use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::str::FromStr;
use tauri::{AppHandle, Manager};
use tauri_specta::Event as TauriEvent;

use crate::{common::get_tags_content, Nostr};

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

pub fn run_fast_sync(accounts: Vec<String>, app_handle: AppHandle) {
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

        // NEG: Sync profile
        //
        let profile = Filter::new()
            .authors(public_keys.clone())
            .kind(Kind::Metadata)
            .limit(4);

        if let Ok(report) = client
            .reconcile_with(&bootstrap_relays, profile, NegentropyOptions::default())
            .await
        {
            NegentropyEvent {
                kind: NegentropyKind::Profile,
                total_event: report.received.len() as i32,
            }
            .emit(&app_handle)
            .unwrap();
        }

        // NEG: Sync contact list
        //
        let contact_list = Filter::new()
            .authors(public_keys.clone())
            .kind(Kind::ContactList)
            .limit(4);

        if let Ok(report) = client
            .reconcile_with(
                &bootstrap_relays,
                contact_list.clone(),
                NegentropyOptions::default(),
            )
            .await
        {
            NegentropyEvent {
                kind: NegentropyKind::Metadata,
                total_event: report.received.len() as i32,
            }
            .emit(&app_handle)
            .unwrap();
        }

        // NEG: Sync events from contact list
        //
        if let Ok(events) = client.database().query(vec![contact_list]).await {
            let pubkeys: Vec<PublicKey> = events
                .iter()
                .flat_map(|ev| {
                    let tags = get_tags_content(ev, TagKind::p());
                    tags.into_iter().filter_map(|p| {
                        if let Ok(pk) = PublicKey::from_hex(p) {
                            Some(pk)
                        } else {
                            None
                        }
                    })
                })
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

                if let Ok(report) = client
                    .reconcile_with(&bootstrap_relays, events, NegentropyOptions::default())
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
                    .kind(Kind::Metadata)
                    .limit(1000);

                if let Ok(report) = client
                    .reconcile_with(&bootstrap_relays, metadata, NegentropyOptions::default())
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

        // NEG: Sync other metadata
        //
        let others = Filter::new().authors(public_keys).kinds(vec![
            Kind::Interests,
            Kind::InterestSet,
            Kind::FollowSet,
            Kind::EventDeletion,
            Kind::Custom(30315),
        ]);

        if let Ok(report) = client
            .reconcile_with(&bootstrap_relays, others, NegentropyOptions::default())
            .await
        {
            NegentropyEvent {
                kind: NegentropyKind::Others,
                total_event: report.received.len() as i32,
            }
            .emit(&app_handle)
            .unwrap();
        }
    });
}
