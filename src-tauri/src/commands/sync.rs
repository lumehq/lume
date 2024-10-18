use nostr_sdk::prelude::*;
use serde::Serialize;
use specta::Type;
use std::str::FromStr;
use tauri::{ipc::Channel, Emitter, Manager};

use crate::{common::get_all_accounts, Nostr, NOTIFICATION_SUB_ID};

#[derive(Clone, Serialize, Type)]
pub enum NegentropyEvent {
    Progress { message: String, total_event: i32 },
}

#[tauri::command]
#[specta::specta]
pub fn run_sync(handle: tauri::AppHandle, reader: Channel<NegentropyEvent>) {
    let accounts = get_all_accounts();

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
        let state = handle.state::<Nostr>();
        let client = &state.client;
        let bootstrap_relays: Vec<Url> = client.pool().all_relays().await.into_keys().collect();

        // Subscribe for new notification
        if let Ok(e) = client
            .subscribe_with_id(
                SubscriptionId::new(NOTIFICATION_SUB_ID),
                vec![Filter::new()
                    .pubkeys(public_keys.clone())
                    .since(Timestamp::now())],
                None,
            )
            .await
        {
            println!("Notificatin subscribed: {}", e.success.len())
        }

        let metadata = Filter::new().authors(public_keys.clone()).kinds(vec![
            Kind::Metadata,
            Kind::ContactList,
            Kind::FollowSet,
            Kind::InterestSet,
            Kind::Interests,
            Kind::EventDeletion,
            Kind::MuteList,
            Kind::BookmarkSet,
            Kind::BlockedRelays,
            Kind::EmojiSet,
            Kind::RelaySet,
            Kind::RelayList,
            Kind::ApplicationSpecificData,
        ]);

        // Syncing all metadata events
        if reader
            .send(NegentropyEvent::Progress {
                message: "Syncing metadata".to_string(),
                total_event: 0,
            })
            .is_ok()
        {
            if let Ok(report) = client
                .reconcile_with(
                    &bootstrap_relays,
                    metadata.clone(),
                    NegentropyOptions::default(),
                )
                .await
            {
                reader
                    .send(NegentropyEvent::Progress {
                        message: "Total events received".to_string(),
                        total_event: report.received.len() as i32,
                    })
                    .unwrap();
            }
        }

        if reader
            .send(NegentropyEvent::Progress {
                message: "Syncing events from contact list".to_string(),
                total_event: 0,
            })
            .is_ok()
        {
            if let Ok(events) = client.database().query(vec![metadata]).await {
                let pubkeys: Vec<PublicKey> = events
                    .iter()
                    .flat_map(|ev| {
                        let tags = ev.get_tags_content(TagKind::p());
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

                    // Syncing all metadata events
                    // Limit: 1000 events
                    if let Ok(report) = client
                        .reconcile_with(
                            &bootstrap_relays,
                            Filter::new()
                                .authors(authors.clone())
                                .kinds(vec![Kind::Metadata, Kind::ContactList])
                                .limit(1000),
                            NegentropyOptions::default(),
                        )
                        .await
                    {
                        reader
                            .send(NegentropyEvent::Progress {
                                message: "Event received".to_string(),
                                total_event: report.received.len() as i32,
                            })
                            .unwrap();
                    }

                    // Syncing all text events
                    // Limit: 1000 events
                    if let Ok(report) = client
                        .reconcile_with(
                            &bootstrap_relays,
                            Filter::new()
                                .authors(authors.clone())
                                .kinds(vec![Kind::TextNote, Kind::Repost])
                                .limit(1000),
                            NegentropyOptions::default(),
                        )
                        .await
                    {
                        // Trigger reload the newsfeed
                        if let Err(e) = handle.emit("synchronized", ()) {
                            println!("Emitter error: {}", e)
                        }

                        reader
                            .send(NegentropyEvent::Progress {
                                message: "Event received".to_string(),
                                total_event: report.received.len() as i32,
                            })
                            .unwrap();
                    }

                    // Syncing all other events
                    // Limit: None
                    if let Ok(report) = client
                        .reconcile_with(
                            &bootstrap_relays,
                            Filter::new().authors(authors).kinds(vec![
                                Kind::FollowSet,
                                Kind::InterestSet,
                                Kind::Interests,
                                Kind::EventDeletion,
                                Kind::MuteList,
                                Kind::BookmarkSet,
                                Kind::RelayList,
                            ]),
                            NegentropyOptions::default(),
                        )
                        .await
                    {
                        reader
                            .send(NegentropyEvent::Progress {
                                message: "Event received".to_string(),
                                total_event: report.received.len() as i32,
                            })
                            .unwrap();
                    }
                }
            };
        };

        // Syncing notification
        if let Ok(report) = client
            .reconcile_with(
                &bootstrap_relays,
                Filter::new()
                    .pubkeys(public_keys)
                    .kinds(vec![Kind::TextNote, Kind::Repost, Kind::ZapReceipt])
                    .limit(1000),
                NegentropyOptions::default(),
            )
            .await
        {
            reader
                .send(NegentropyEvent::Progress {
                    message: "Syncing notification".to_string(),
                    total_event: report.received.len() as i32,
                })
                .unwrap();
        }

        // Trigger hide the sync badge in front-end.
        reader
            .send(NegentropyEvent::Progress {
                message: "Ok".to_string(),
                total_event: 0,
            })
            .unwrap();
    });
}
