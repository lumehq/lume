use nostr_sdk::prelude::*;
use serde::Serialize;
use specta::Type;
use std::{str::FromStr, time::Duration};
use tauri::State;

use crate::common::{create_tags, parse_event, process_event, Meta};
use crate::{Nostr, DEFAULT_DIFFICULTY, FETCH_LIMIT};

#[derive(Debug, Clone, Serialize, Type)]
pub struct RichEvent {
    pub raw: String,
    pub parsed: Option<Meta>,
}

#[tauri::command]
#[specta::specta]
pub async fn get_event(id: String, state: State<'_, Nostr>) -> Result<RichEvent, String> {
    let client = &state.client;
    let event_id = EventId::from_str(&id).map_err(|err| err.to_string())?;

    let events = client
        .database()
        .event_by_id(&event_id)
        .await
        .map_err(|err| err.to_string())?;

    if let Some(event) = events {
        let raw = event.as_json();
        let parsed = if event.kind == Kind::TextNote {
            Some(parse_event(&event.content).await)
        } else {
            None
        };

        Ok(RichEvent { raw, parsed })
    } else {
        let filter = Filter::new().id(event_id).limit(1);
        let mut events = Events::new(&[filter.clone()]);
        let mut rx = client
            .stream_events(vec![filter], Some(Duration::from_secs(5)))
            .await
            .map_err(|e| e.to_string())?;

        while let Some(event) = rx.next().await {
            events.insert(event);
        }

        if let Some(event) = events.first() {
            let raw = event.as_json();
            let parsed = if event.kind == Kind::TextNote {
                Some(parse_event(&event.content).await)
            } else {
                None
            };

            Ok(RichEvent { raw, parsed })
        } else {
            Err("Event not found.".into())
        }
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_meta_from_event(content: String) -> Result<Meta, ()> {
    Ok(parse_event(&content).await)
}

#[tauri::command]
#[specta::specta]
pub async fn get_replies(id: String, state: State<'_, Nostr>) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let event_id = EventId::parse(&id).map_err(|err| err.to_string())?;

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Custom(1111)])
        .event(event_id);

    let mut events = Events::new(&[filter.clone()]);

    let mut rx = client
        .stream_events(vec![filter], Some(Duration::from_secs(3)))
        .await
        .map_err(|e| e.to_string())?;

    while let Some(event) = rx.next().await {
        events.insert(event);
    }

    let alt_events = process_event(client, events, true).await;

    Ok(alt_events)
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_events_by_author(
    public_key: String,
    limit: i32,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let author = PublicKey::parse(&public_key).map_err(|err| err.to_string())?;

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .author(author)
        .limit(limit as usize);

    let mut events = Events::new(&[filter.clone()]);

    let mut rx = client
        .stream_events(vec![filter], Some(Duration::from_secs(3)))
        .await
        .map_err(|e| e.to_string())?;

    while let Some(event) = rx.next().await {
        events.insert(event);
    }

    let alt_events = process_event(client, events, false).await;

    Ok(alt_events)
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_events_by_authors(
    public_keys: Vec<String>,
    until: Option<String>,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;

    let as_of = match until {
        Some(until) => Timestamp::from_str(&until).unwrap_or(Timestamp::now()),
        None => Timestamp::now(),
    };

    let authors: Vec<PublicKey> = public_keys
        .iter()
        .filter_map(|pk| PublicKey::from_str(pk).ok())
        .collect();

    let filter = Filter::new()
        .authors(authors)
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(FETCH_LIMIT)
        .until(as_of);

    let mut events = Events::new(&[filter.clone()]);

    let mut rx = client
        .stream_events(vec![filter], Some(Duration::from_secs(3)))
        .await
        .map_err(|e| e.to_string())?;

    while let Some(event) = rx.next().await {
        events.insert(event);
    }

    let alt_events = process_event(client, events, false).await;

    Ok(alt_events)
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_events_by_hashtags(
    hashtags: Vec<String>,
    until: Option<String>,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;

    let as_of = match until {
        Some(until) => Timestamp::from_str(&until).map_err(|err| err.to_string())?,
        None => Timestamp::now(),
    };

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(FETCH_LIMIT)
        .until(as_of)
        .hashtags(hashtags);

    let mut events = Events::new(&[filter.clone()]);

    let mut rx = client
        .stream_events(vec![filter], Some(Duration::from_secs(3)))
        .await
        .map_err(|e| e.to_string())?;

    while let Some(event) = rx.next().await {
        events.insert(event);
    }

    let alt_events = process_event(client, events, false).await;

    Ok(alt_events)
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_events_from(
    url: String,
    until: Option<String>,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;

    let _ = client.add_read_relay(&url).await;
    let _ = client.connect_relay(&url).await;

    let as_of = match until {
        Some(until) => Timestamp::from_str(&until).map_err(|err| err.to_string())?,
        None => Timestamp::now(),
    };

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(FETCH_LIMIT)
        .until(as_of);

    let mut events = Events::new(&[filter.clone()]);

    let mut rx = client
        .stream_events_from(vec![url], vec![filter], Some(Duration::from_secs(3)))
        .await
        .map_err(|e| e.to_string())?;

    while let Some(event) = rx.next().await {
        events.insert(event);
    }

    let alt_events = process_event(client, events, false).await;

    Ok(alt_events)
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_events_by_kind(
    kind: u16,
    until: Option<String>,
    state: State<'_, Nostr>,
) -> Result<Vec<String>, String> {
    let client = &state.client;

    let as_of = match until {
        Some(until) => Timestamp::from_str(&until).map_err(|err| err.to_string())?,
        None => Timestamp::now(),
    };

    let filter = Filter::new()
        .kind(Kind::Custom(kind))
        .limit(FETCH_LIMIT)
        .until(as_of);

    let mut events = Events::new(&[filter.clone()]);

    let mut rx = client
        .stream_events(vec![filter], Some(Duration::from_secs(3)))
        .await
        .map_err(|e| e.to_string())?;

    while let Some(event) = rx.next().await {
        events.insert(event);
    }

    let alt_events: Vec<String> = events.iter().map(|ev| ev.as_json()).collect();

    Ok(alt_events)
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_providers(state: State<'_, Nostr>) -> Result<Vec<String>, String> {
    let client = &state.client;

    let filter = Filter::new()
        .kind(Kind::Custom(31990))
        .custom_tag(SingleLetterTag::lowercase(Alphabet::K), vec!["5300"]);

    let mut events = Events::new(&[filter.clone()]);

    let mut rx = client
        .stream_events(vec![filter], Some(Duration::from_secs(3)))
        .await
        .map_err(|e| e.to_string())?;

    while let Some(event) = rx.next().await {
        events.insert(event);
    }

    let alt_events: Vec<String> = events.iter().map(|ev| ev.as_json()).collect();

    Ok(alt_events)
}

#[tauri::command]
#[specta::specta]
pub async fn request_events_from_provider(
    provider: String,
    state: State<'_, Nostr>,
) -> Result<String, String> {
    let client = &state.client;
    let signer = client.signer().await.map_err(|err| err.to_string())?;
    let public_key = signer
        .get_public_key()
        .await
        .map_err(|err| err.to_string())?;
    let provider = PublicKey::parse(&provider).map_err(|err| err.to_string())?;

    // Get current user's relay list
    let relay_list = client
        .database()
        .relay_list(public_key)
        .await
        .map_err(|err| err.to_string())?;

    let relay_list: Vec<String> = relay_list.iter().map(|item| item.0.to_string()).collect();

    // Create job request
    let builder = EventBuilder::job_request(
        Kind::JobRequest(5300),
        vec![
            Tag::public_key(provider),
            Tag::custom(TagKind::Relays, relay_list),
        ],
    )
    .map_err(|err| err.to_string())?;

    match client.send_event_builder(builder).await {
        Ok(output) => {
            let filter = Filter::new()
                .kind(Kind::JobResult(6300))
                .author(provider)
                .pubkey(public_key)
                .since(Timestamp::now());

            let opts = SubscribeAutoCloseOptions::default()
                .filter(FilterOptions::WaitDurationAfterEOSE(Duration::from_secs(2)));

            let _ = client.subscribe(vec![filter], Some(opts)).await;

            Ok(output.val.to_hex())
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_events_by_request(
    id: String,
    provider: String,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let public_key = PublicKey::parse(&id).map_err(|err| err.to_string())?;
    let provider = PublicKey::parse(&provider).map_err(|err| err.to_string())?;

    let filter = Filter::new()
        .kind(Kind::JobResult(6300))
        .author(provider)
        .pubkey(public_key)
        .limit(1);

    let events = client
        .database()
        .query(vec![filter])
        .await
        .map_err(|err| err.to_string())?;

    if let Some(event) = events.first() {
        let parsed: Vec<Vec<String>> =
            serde_json::from_str(&event.content).map_err(|err| err.to_string())?;

        let vec: Vec<Tag> = parsed
            .into_iter()
            .filter_map(|item| Tag::parse(&item).ok())
            .collect::<Vec<_>>();

        let tags = Tags::new(vec);
        let ids: Vec<EventId> = tags.event_ids().copied().collect();

        let filter = Filter::new().ids(ids);
        let mut events = Events::new(&[filter.clone()]);

        let mut rx = client
            .stream_events(vec![filter], Some(Duration::from_secs(3)))
            .await
            .map_err(|e| e.to_string())?;

        while let Some(event) = rx.next().await {
            events.insert(event);
        }

        let alt_events = process_event(client, events, false).await;

        Ok(alt_events)
    } else {
        Err("Job result not found.".into())
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_local_events(
    until: Option<String>,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;

    let as_of = match until {
        Some(until) => Timestamp::from_str(&until).map_err(|err| err.to_string())?,
        None => Timestamp::now(),
    };

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(FETCH_LIMIT)
        .until(as_of);

    match client.database().query(vec![filter]).await {
        Ok(events) => Ok(process_event(client, events, false).await),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_global_events(
    until: Option<String>,
    state: State<'_, Nostr>,
) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;

    let as_of = match until {
        Some(until) => Timestamp::from_str(&until).map_err(|err| err.to_string())?,
        None => Timestamp::now(),
    };

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(FETCH_LIMIT)
        .until(as_of);

    match client.database().query(vec![filter]).await {
        Ok(events) => Ok(process_event(client, events, false).await),
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

    // Create event tags from content
    let mut tags = create_tags(&content);

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

    // Sign event
    let event = client
        .sign_event_builder(builder)
        .await
        .map_err(|err| err.to_string())?;

    // Save to local database
    match client.send_event(event).await {
        Ok(output) => Ok(output.to_hex()),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn reply(content: String, to: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;

    // Create event tags from content
    let mut tags = create_tags(&content);

    // Add client tag
    // TODO: allow user config this setting
    tags.push(Tag::custom(TagKind::custom("client"), vec!["Lume"]));

    // Get reply event
    let reply_id = EventId::parse(&to).map_err(|err| err.to_string())?;

    let reply_to = match client.database().event_by_id(&reply_id).await {
        Ok(event) => {
            if let Some(event) = event {
                event
            } else {
                return Err("Event not found in database, cannot reply.".into());
            }
        }
        Err(e) => return Err(e.to_string()),
    };

    // Detect root event from reply
    let root_ids: Vec<&EventId> = reply_to
        .tags
        .filter_standardized(TagKind::e())
        .filter_map(|t| match t {
            TagStandard::Event {
                event_id, marker, ..
            } => {
                if let Some(mkr) = marker {
                    match mkr {
                        Marker::Root => Some(event_id),
                        Marker::Reply => Some(event_id),
                        _ => None,
                    }
                } else {
                    Some(event_id)
                }
            }
            _ => None,
        })
        .collect();

    // Get root event if exist
    let root = match root_ids.first() {
        Some(&id) => client
            .database()
            .event_by_id(id)
            .await
            .map_err(|err| err.to_string())?,
        None => None,
    };

    let builder = EventBuilder::text_note_reply(content, &reply_to, root.as_ref(), None)
        .add_tags(tags)
        .pow(DEFAULT_DIFFICULTY);

    // Sign event
    let event = client
        .sign_event_builder(builder)
        .await
        .map_err(|err| err.to_string())?;

    match client.send_event(event).await {
        Ok(output) => Ok(output.to_hex()),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn repost(raw: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let event = Event::from_json(raw).map_err(|err| err.to_string())?;

    match client.repost(&event, None).await {
        Ok(output) => Ok(output.to_hex()),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn is_reposted(id: String, state: State<'_, Nostr>) -> Result<bool, String> {
    let client = &state.client;
    let signer = client.signer().await.map_err(|err| err.to_string())?;
    let public_key = signer
        .get_public_key()
        .await
        .map_err(|err| err.to_string())?;

    let event_id = EventId::parse(&id).map_err(|err| err.to_string())?;

    let filter = Filter::new()
        .event(event_id)
        .kind(Kind::Repost)
        .author(public_key);

    match client.database().query(vec![filter]).await {
        Ok(events) => Ok(!events.is_empty()),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn request_delete(id: String, state: State<'_, Nostr>) -> Result<(), String> {
    let client = &state.client;
    let event_id = EventId::from_str(&id).map_err(|err| err.to_string())?;

    match client.delete_event(event_id).await {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn is_deleted_event(id: String, state: State<'_, Nostr>) -> Result<bool, String> {
    let client = &state.client;
    let signer = client.signer().await.map_err(|err| err.to_string())?;
    let public_key = signer
        .get_public_key()
        .await
        .map_err(|err| err.to_string())?;

    let event_id = EventId::from_str(&id).map_err(|err| err.to_string())?;

    let filter = Filter::new()
        .author(public_key)
        .event(event_id)
        .kind(Kind::EventDeletion);

    match client.database().query(vec![filter]).await {
        Ok(events) => Ok(!events.is_empty()),
        Err(e) => Err(e.to_string()),
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
pub async fn user_to_bech32(user: String, state: State<'_, Nostr>) -> Result<String, String> {
    let client = &state.client;
    let public_key = PublicKey::parse(user).map_err(|err| err.to_string())?;

    match client
        .database()
        .query(vec![Filter::new()
            .author(public_key)
            .kind(Kind::RelayList)
            .limit(1)])
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
pub async fn search(query: String, state: State<'_, Nostr>) -> Result<Vec<RichEvent>, String> {
    let client = &state.client;
    let filter = Filter::new().search(query);

    match client.database().query(vec![filter]).await {
        Ok(events) => Ok(process_event(client, events, false).await),
        Err(e) => Err(e.to_string()),
    }
}
