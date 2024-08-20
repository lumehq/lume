use futures::future::join_all;
use nostr_sdk::prelude::*;
use serde::Serialize;
use specta::Type;
use std::{str::FromStr, time::Duration};
use tauri::State;

use crate::common::{create_event_tags, dedup_event, parse_event, Meta};
use crate::{Nostr, FETCH_LIMIT};

#[derive(Debug, Clone, Serialize, Type)]
pub struct RichEvent {
    pub raw: String,
    pub parsed: Option<Meta>,
}

#[tauri::command]
#[specta::specta]
pub async fn get_event_meta(content: &str) -> Result<Meta, ()> {
    let meta = parse_event(content).await;
    Ok(meta)
}

#[tauri::command]
#[specta::specta]
pub async fn get_event(id: &str, state: State<'_, Nostr>) -> Result<RichEvent, String> {
    let client = &state.client;

    let event_id = match Nip19::from_bech32(id) {
        Ok(val) => match val {
            Nip19::EventId(id) => id,
            Nip19::Event(event) => event.event_id,
            _ => return Err("Event ID is not valid.".into()),
        },
        Err(_) => match EventId::from_hex(id) {
            Ok(id) => id,
            Err(_) => return Err("Event ID is not valid.".into()),
        },
    };

    match client
        .get_events_of(
            vec![Filter::new().id(event_id)],
            EventSource::both(Some(Duration::from_secs(5))),
        )
        .await
    {
        Ok(events) => {
            if let Some(event) = events.first() {
                let raw = event.as_json();
                let parsed = if event.kind == Kind::TextNote {
                    Some(parse_event(&event.content).await)
                } else {
                    None
                };

                Ok(RichEvent { raw, parsed })
            } else {
                Err("Cannot found this event with current relay list".into())
            }
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_event_from(
    id: &str,
    relay_hint: &str,
    state: State<'_, Nostr>,
) -> Result<RichEvent, String> {
    let client = &state.client;
    let settings = state.settings.lock().await;

    let event_id = match Nip19::from_bech32(id) {
        Ok(val) => match val {
            Nip19::EventId(id) => id,
            Nip19::Event(event) => event.event_id,
            _ => return Err("Event ID is not valid.".into()),
        },
        Err(_) => match EventId::from_hex(id) {
            Ok(id) => id,
            Err(_) => return Err("Event ID is not valid.".into()),
        },
    };

    if !settings.use_relay_hint {
        match client
            .get_events_of(
                vec![Filter::new().id(event_id)],
                EventSource::both(Some(Duration::from_secs(5))),
            )
            .await
        {
            Ok(events) => {
                if let Some(event) = events.first() {
                    let raw = event.as_json();
                    let parsed = if event.kind == Kind::TextNote {
                        Some(parse_event(&event.content).await)
                    } else {
                        None
                    };

                    Ok(RichEvent { raw, parsed })
                } else {
                    Err("Cannot found this event with current relay list".into())
                }
            }
            Err(err) => Err(err.to_string()),
        }
    } else {
        // Add relay hint to relay pool
        if let Err(err) = client.add_relay(relay_hint).await {
            return Err(err.to_string());
        }

        if client.connect_relay(relay_hint).await.is_ok() {
            match client
                .get_events_from(vec![relay_hint], vec![Filter::new().id(event_id)], None)
                .await
            {
                Ok(events) => {
                    if let Some(event) = events.first() {
                        let raw = event.as_json();
                        let parsed = if event.kind == Kind::TextNote {
                            Some(parse_event(&event.content).await)
                        } else {
                            None
                        };

                        Ok(RichEvent { raw, parsed })
                    } else {
                        Err("Cannot found this event with current relay list".into())
                    }
                }
                Err(err) => Err(err.to_string()),
            }
        } else {
            Err("Relay connection failed.".into())
        }
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_replies(id: &str, state: State<'_, Nostr>) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;

    let event_id = match EventId::from_hex(id) {
        Ok(id) => id,
        Err(err) => return Err(err.to_string()),
    };

    let filter = Filter::new().kinds(vec![Kind::TextNote]).event(event_id);

    match client
        .get_events_of(
            vec![filter],
            EventSource::both(Some(Duration::from_secs(5))),
        )
        .await
    {
        Ok(events) => {
            let futures = events.into_iter().map(|ev| async move {
                let raw = ev.as_json();
                let parsed = if ev.kind == Kind::TextNote {
                    Some(parse_event(&ev.content).await)
                } else {
                    None
                };

                RichEvent { raw, parsed }
            });
            let rich_events = join_all(futures).await;

            Ok(rich_events)
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn listen_event_reply(id: &str, state: State<'_, Nostr>) -> Result<(), String> {
    let client = &state.client;

    let mut label = "event-".to_owned();
    label.push_str(id);

    let sub_id = SubscriptionId::new(label);
    let event_id = match EventId::from_hex(id) {
        Ok(id) => id,
        Err(err) => return Err(err.to_string()),
    };
    let filter = Filter::new()
        .kinds(vec![Kind::TextNote])
        .event(event_id)
        .since(Timestamp::now());

    // Subscribe
    let _ = client.subscribe_with_id(sub_id, vec![filter], None).await;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn get_events_by(
    public_key: &str,
    as_of: Option<&str>,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;

    match PublicKey::from_str(public_key) {
        Ok(author) => {
            let until = match as_of {
                Some(until) => Timestamp::from_str(until).map_err(|err| err.to_string())?,
                None => Timestamp::now(),
            };
            let filter = Filter::new()
                .kinds(vec![Kind::TextNote, Kind::Repost])
                .author(author)
                .limit(FETCH_LIMIT)
                .until(until);

            match client
                .get_events_of(
                    vec![filter],
                    EventSource::both(Some(Duration::from_secs(5))),
                )
                .await
            {
                Ok(events) => {
                    let futures = events.into_iter().map(|ev| async move {
                        let raw = ev.as_json();
                        let parsed = if ev.kind == Kind::TextNote {
                            Some(parse_event(&ev.content).await)
                        } else {
                            None
                        };

                        RichEvent { raw, parsed }
                    });
                    let rich_events = join_all(futures).await;

                    Ok(rich_events)
                }
                Err(err) => Err(err.to_string()),
            }
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_local_events(
    until: Option<&str>,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let contact_list = state.contact_list.lock().await;
    let authors: Vec<PublicKey> = contact_list.iter().map(|f| f.public_key).collect();

    let as_of = match until {
        Some(until) => Timestamp::from_str(until).map_err(|err| err.to_string())?,
        None => Timestamp::now(),
    };

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(FETCH_LIMIT)
        .until(as_of)
        .authors(authors);

    match client.database().query(vec![filter], Order::Desc).await {
        Ok(events) => {
            let dedup = dedup_event(&events);
            let futures = dedup.into_iter().map(|ev| async move {
                let raw = ev.as_json();
                let parsed = if ev.kind == Kind::TextNote {
                    Some(parse_event(&ev.content).await)
                } else {
                    None
                };

                RichEvent { raw, parsed }
            });
            let rich_events = join_all(futures).await;

            Ok(rich_events)
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_group_events(
    public_keys: Vec<&str>,
    until: Option<&str>,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;

    let as_of = match until {
        Some(until) => Timestamp::from_str(until).map_err(|err| err.to_string())?,
        None => Timestamp::now(),
    };

    let authors: Vec<PublicKey> = public_keys
        .into_iter()
        .map(|p| {
            if p.starts_with("npub1") {
                PublicKey::from_bech32(p).map_err(|err| err.to_string())
            } else {
                PublicKey::from_hex(p).map_err(|err| err.to_string())
            }
        })
        .collect::<Result<Vec<_>, _>>()?;

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(FETCH_LIMIT)
        .until(as_of)
        .authors(authors);

    match client
        .get_events_of(
            vec![filter],
            EventSource::both(Some(Duration::from_secs(5))),
        )
        .await
    {
        Ok(events) => {
            let dedup = dedup_event(&events);

            let futures = dedup.into_iter().map(|ev| async move {
                let raw = ev.as_json();
                let parsed = if ev.kind == Kind::TextNote {
                    Some(parse_event(&ev.content).await)
                } else {
                    None
                };

                RichEvent { raw, parsed }
            });

            let rich_events = join_all(futures).await;

            Ok(rich_events)
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_global_events(
    until: Option<&str>,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let as_of = match until {
        Some(until) => Timestamp::from_str(until).map_err(|err| err.to_string())?,
        None => Timestamp::now(),
    };

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(FETCH_LIMIT)
        .until(as_of);

    match client
        .get_events_of(
            vec![filter],
            EventSource::both(Some(Duration::from_secs(5))),
        )
        .await
    {
        Ok(events) => {
            let dedup = dedup_event(&events);
            let futures = dedup.into_iter().map(|ev| async move {
                let raw = ev.as_json();
                let parsed = if ev.kind == Kind::TextNote {
                    Some(parse_event(&ev.content).await)
                } else {
                    None
                };

                RichEvent { raw, parsed }
            });
            let rich_events = join_all(futures).await;

            Ok(rich_events)
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_hashtag_events(
    hashtags: Vec<&str>,
    until: Option<&str>,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let as_of = match until {
        Some(until) => Timestamp::from_str(until).map_err(|err| err.to_string())?,
        None => Timestamp::now(),
    };
    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(FETCH_LIMIT)
        .until(as_of)
        .hashtags(hashtags);

    match client
        .get_events_of(
            vec![filter],
            EventSource::both(Some(Duration::from_secs(5))),
        )
        .await
    {
        Ok(events) => {
            let dedup = dedup_event(&events);
            let futures = dedup.into_iter().map(|ev| async move {
                let raw = ev.as_json();
                let parsed = if ev.kind == Kind::TextNote {
                    Some(parse_event(&ev.content).await)
                } else {
                    None
                };

                RichEvent { raw, parsed }
            });
            let rich_events = join_all(futures).await;

            Ok(rich_events)
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn publish(
    content: String,
    warning: Option<String>,
    difficulty: Option<u8>,
    state: State<'_, Nostr>,
) -> Result<String, String> {
    let client = &state.client;

    // Create tags from content
    let mut tags = create_event_tags(&content);

    // Add content-warning tag if present
    if let Some(reason) = warning {
        let t = TagStandard::ContentWarning {
            reason: Some(reason),
        };
        let tag = Tag::from(t);
        tags.push(tag)
    };

    // Get signer
    let signer = match client.signer().await {
        Ok(signer) => signer,
        Err(_) => return Err("Signer is required.".into()),
    };

    // Get public key
    let public_key = signer.public_key().await.map_err(|err| err.to_string())?;

    // Create unsigned event
    let unsigned_event = match difficulty {
        Some(num) => EventBuilder::text_note(content, tags).to_unsigned_pow_event(public_key, num),
        None => EventBuilder::text_note(content, tags).to_unsigned_event(public_key),
    };

    // Publish
    match signer.sign_event(unsigned_event).await {
        Ok(event) => match client.send_event(event).await {
            Ok(event_id) => Ok(event_id.to_bech32().map_err(|err| err.to_string())?),
            Err(err) => Err(err.to_string()),
        },
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn reply(
    content: String,
    to: String,
    root: Option<String>,
    state: State<'_, Nostr>,
) -> Result<String, String> {
    let client = &state.client;
    let database = client.database();

    // Create tags from content
    let mut tags = create_event_tags(&content);

    let reply_id = match EventId::from_hex(to) {
        Ok(val) => val,
        Err(_) => return Err("Event is not valid.".into()),
    };

    match database
        .query(vec![Filter::new().id(reply_id)], Order::Desc)
        .await
    {
        Ok(events) => {
            if let Some(event) = events.into_iter().next() {
                let relay_hint = if let Some(relays) = database
                    .event_seen_on_relays(event.id)
                    .await
                    .map_err(|err| err.to_string())?
                {
                    relays.into_iter().next().map(UncheckedUrl::new)
                } else {
                    None
                };
                let t = TagStandard::Event {
                    event_id: event.id,
                    relay_url: relay_hint,
                    marker: Some(Marker::Reply),
                    public_key: Some(event.pubkey),
                };
                let tag = Tag::from(t);
                tags.push(tag)
            } else {
                return Err("Reply event is not found.".into());
            }
        }
        Err(err) => return Err(err.to_string()),
    };

    if let Some(id) = root {
        let root_id = match EventId::from_hex(id) {
            Ok(val) => val,
            Err(_) => return Err("Event is not valid.".into()),
        };

        if let Ok(events) = database
            .query(vec![Filter::new().id(root_id)], Order::Desc)
            .await
        {
            if let Some(event) = events.into_iter().next() {
                let relay_hint = if let Some(relays) = database
                    .event_seen_on_relays(event.id)
                    .await
                    .map_err(|err| err.to_string())?
                {
                    relays.into_iter().next().map(UncheckedUrl::new)
                } else {
                    None
                };
                let t = TagStandard::Event {
                    event_id: event.id,
                    relay_url: relay_hint,
                    marker: Some(Marker::Root),
                    public_key: Some(event.pubkey),
                };
                let tag = Tag::from(t);
                tags.push(tag)
            }
        }
    };

    match client.publish_text_note(content, tags).await {
        Ok(event_id) => Ok(event_id.to_bech32().map_err(|err| err.to_string())?),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn repost(raw: &str, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let event = Event::from_json(raw).map_err(|err| err.to_string())?;

    match client.repost(&event, None).await {
        Ok(event_id) => Ok(event_id.to_string()),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn event_to_bech32(id: &str, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;

    let event_id = match EventId::from_hex(id) {
        Ok(id) => id,
        Err(_) => return Err("ID is not valid.".into()),
    };

    let seens = client
        .database()
        .event_seen_on_relays(event_id)
        .await
        .map_err(|err| err.to_string())?;

    match seens {
        Some(set) => {
            let relays = set.into_iter().collect::<Vec<_>>();
            let event = Nip19Event::new(event_id, relays);

            match event.to_bech32() {
                Ok(id) => Ok(id),
                Err(err) => Err(err.to_string()),
            }
        }
        None => match event_id.to_bech32() {
            Ok(id) => Ok(id),
            Err(err) => Err(err.to_string()),
        },
    }
}

#[tauri::command]
#[specta::specta]
pub async fn user_to_bech32(user: &str, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;

    let public_key = match PublicKey::from_str(user) {
        Ok(pk) => pk,
        Err(_) => return Err("Public Key is not valid.".into()),
    };

    match client
        .get_events_of(
            vec![Filter::new()
                .author(public_key)
                .kind(Kind::RelayList)
                .limit(1)],
            EventSource::both(Some(Duration::from_secs(5))),
        )
        .await
    {
        Ok(events) => match events.first() {
            Some(event) => {
                let relay_list = nip65::extract_relay_list(event);
                let relays = relay_list
                    .into_iter()
                    .map(|i| i.0.to_string())
                    .collect::<Vec<_>>();
                let profile =
                    Nip19Profile::new(public_key, relays).map_err(|err| err.to_string())?;

                Ok(profile.to_bech32().map_err(|err| err.to_string())?)
            }
            None => match public_key.to_bech32() {
                Ok(pk) => Ok(pk),
                Err(err) => Err(err.to_string()),
            },
        },
        Err(_) => match public_key.to_bech32() {
            Ok(pk) => Ok(pk),
            Err(err) => Err(err.to_string()),
        },
    }
}

#[tauri::command]
#[specta::specta]
pub async fn unlisten(label: String, state: State<'_, Nostr>) -> Result<(), ()> {
    let client = &state.client;
    let sub_id = SubscriptionId::new(label);

    // Remove subscription
    client.unsubscribe(sub_id).await;

    Ok(())
}
