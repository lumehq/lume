use futures::future::join_all;
use nostr_sdk::prelude::*;
use serde::Serialize;
use specta::Type;
use std::{str::FromStr, time::Duration};
use tauri::State;

use crate::common::{create_event_tags, filter_converstation, parse_event, Meta};
use crate::{Nostr, DEFAULT_DIFFICULTY, FETCH_LIMIT};

#[derive(Debug, Clone, Serialize, Type)]
pub struct RichEvent {
    pub raw: String,
    pub parsed: Option<Meta>,
}

#[tauri::command]
#[specta::specta]
pub async fn get_event_meta(content: String) -> Result<Meta, ()> {
    let meta = parse_event(&content).await;
    Ok(meta)
}

#[tauri::command]
#[specta::specta]
pub async fn get_event(id: String, state: State<'_, Nostr>) -> Result<RichEvent, String> {
    let client = &state.client;
    let event_id = EventId::parse(&id).map_err(|err| err.to_string())?;
    let filter = Filter::new().id(event_id);

    match client
        .get_events_of(
            vec![filter],
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
    id: String,
    relay_hint: String,
    state: State<'_, Nostr>,
) -> Result<RichEvent, String> {
    let client = &state.client;
    let settings = state.settings.lock().await;
    let event_id = EventId::parse(&id).map_err(|err| err.to_string())?;
    let filter = Filter::new().id(event_id);

    if !settings.use_relay_hint {
        match client
            .get_events_of(
                vec![filter],
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
        if let Err(e) = client.add_relay(&relay_hint).await {
            return Err(e.to_string());
        }

        if let Err(e) = client.connect_relay(&relay_hint).await {
            return Err(e.to_string());
        }

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
}

#[tauri::command]
#[specta::specta]
pub async fn get_replies(id: String, state: State<'_, Nostr>) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let event_id = EventId::parse(&id).map_err(|err| err.to_string())?;
    let filter = Filter::new().kinds(vec![Kind::TextNote]).event(event_id);

    match client
        .get_events_of(
            vec![filter],
            EventSource::both(Some(Duration::from_secs(5))),
        )
        .await
    {
        Ok(events) => {
            let futures = events.iter().map(|ev| async move {
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
pub async fn subscribe_to(id: String, state: State<'_, Nostr>) -> Result<(), String> {
    let client = &state.client;

    let subscription_id = SubscriptionId::new(&id);
    let event_id = EventId::parse(&id).map_err(|err| err.to_string())?;

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote])
        .event(event_id)
        .since(Timestamp::now());

    match client
        .subscribe_with_id(subscription_id, vec![filter], None)
        .await
    {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_events_by(
    public_key: String,
    limit: i32,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let author = PublicKey::parse(&public_key).map_err(|err| err.to_string())?;

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote])
        .author(author)
        .limit(limit as usize);

    match client
        .get_events_of(
            vec![filter],
            EventSource::both(Some(Duration::from_secs(5))),
        )
        .await
    {
        Ok(events) => {
            let fils = filter_converstation(events);
            let futures = fils.iter().map(|ev| async move {
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
pub async fn get_events_from_contacts(
    until: Option<&str>,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let contact_list = state.contact_list.lock().await;
    let authors: Vec<PublicKey> = contact_list.iter().map(|f| f.public_key).collect();

    if authors.is_empty() {
        return Err("Contact List is empty.".into());
    }

    let as_of = match until {
        Some(until) => Timestamp::from_str(until).map_err(|err| err.to_string())?,
        None => Timestamp::now(),
    };

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(FETCH_LIMIT)
        .until(as_of)
        .authors(authors);

    match client.database().query(vec![filter]).await {
        Ok(events) => {
            let fils = filter_converstation(events);
            let futures = fils.iter().map(|ev| async move {
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
        .iter()
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
            let fils = filter_converstation(events);
            let futures = fils.iter().map(|ev| async move {
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
            let fils = filter_converstation(events);
            let futures = fils.iter().map(|ev| async move {
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
            let fils = filter_converstation(events);
            let futures = fils.iter().map(|ev| async move {
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

    // Add client tag
    // TODO: allow user config this setting
    tags.push(Tag::custom(TagKind::custom("client"), vec!["Lume"]));

    // Add content-warning tag if present
    if let Some(reason) = warning {
        let t = TagStandard::ContentWarning {
            reason: Some(reason),
        };
        let tag = Tag::from_standardized(t);
        tags.push(tag)
    };

    // Create unsigned event
    let builder =
        EventBuilder::text_note(content, tags).pow(difficulty.unwrap_or(DEFAULT_DIFFICULTY));

    // Publish
    match client.send_event_builder(builder).await {
        Ok(event_id) => Ok(event_id.to_bech32().unwrap()),
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

    let reply_id = EventId::parse(&to).map_err(|err| err.to_string())?;

    match database.query(vec![Filter::new().id(reply_id)]).await {
        Ok(events) => {
            if let Some(event) = events.first() {
                let relay_hint = if let Some(relays) = database
                    .event_seen_on_relays(&event.id)
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

        if let Ok(events) = database.query(vec![Filter::new().id(root_id)]).await {
            if let Some(event) = events.first() {
                let relay_hint = if let Some(relays) = database
                    .event_seen_on_relays(&event.id)
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
pub async fn delete(id: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let event_id = EventId::parse(&id).map_err(|err| err.to_string())?;

    match client.delete_event(event_id).await {
        Ok(event_id) => Ok(event_id.to_string()),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn event_to_bech32(id: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let event_id = EventId::parse(&id).map_err(|err| err.to_string())?;

    let seens = client
        .database()
        .event_seen_on_relays(&event_id)
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
    let public_key = PublicKey::parse(user).map_err(|err| err.to_string())?;

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
pub async fn search(
    query: String,
    until: Option<String>,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;

    let timestamp = match until {
        Some(str) => Timestamp::from_str(&str).map_err(|err| err.to_string())?,
        None => Timestamp::now(),
    };

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Metadata])
        .search(query)
        .until(timestamp)
        .limit(FETCH_LIMIT);

    match client
        .get_events_of(
            vec![filter],
            EventSource::both(Some(Duration::from_secs(5))),
        )
        .await
    {
        Ok(events) => {
            let fils = filter_converstation(events);
            let futures = fils.iter().map(|ev| async move {
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
        Err(e) => Err(e.to_string()),
    }
}
