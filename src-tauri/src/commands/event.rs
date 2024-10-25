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

    match client.database().event_by_id(&event_id).await {
        Ok(events) => {
            if let Some(event) = events {
                let raw = event.as_json();
                let parsed = if event.kind == Kind::TextNote {
                    Some(parse_event(&event.content).await)
                } else {
                    None
                };

                Ok(RichEvent { raw, parsed })
            } else {
                Err("Event not found".to_string())
            }
        }
        Err(err) => Err(err.to_string()),
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
    let filter = Filter::new().kinds(vec![Kind::TextNote]).event(event_id);

    match client
        .fetch_events(vec![filter], Some(Duration::from_secs(5)))
        .await
    {
        Ok(events) => Ok(process_event(client, events).await),
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

    match client.database().query(vec![filter]).await {
        Ok(events) => Ok(process_event(client, events).await),
        Err(err) => Err(err.to_string()),
    }
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
        Some(until) => Timestamp::from_str(&until).map_err(|err| err.to_string())?,
        None => Timestamp::now(),
    };

    let authors: Vec<PublicKey> = public_keys
        .iter()
        .map(|pk| PublicKey::from_str(pk).map_err(|err| err.to_string()))
        .collect::<Result<Vec<_>, _>>()?;

    let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(FETCH_LIMIT)
        .until(as_of)
        .authors(authors);

    match client.database().query(vec![filter]).await {
        Ok(events) => Ok(process_event(client, events).await),
        Err(err) => Err(err.to_string()),
    }
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

    match client
        .fetch_events(vec![filter], Some(Duration::from_secs(5)))
        .await
    {
        Ok(events) => Ok(process_event(client, events).await),
        Err(err) => Err(err.to_string()),
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
        Ok(events) => Ok(process_event(client, events).await),
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

    match client
        .fetch_events(vec![filter], Some(Duration::from_secs(5)))
        .await
    {
        Ok(events) => Ok(process_event(client, events).await),
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
pub async fn reply(
    content: String,
    to: String,
    root: Option<String>,
    state: State<'_, Nostr>,
) -> Result<String, String> {
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

    // Get root event if exist
    let root = match root {
        Some(id) => {
            let root_id = EventId::parse(&id).map_err(|err| err.to_string())?;
            (client.database().event_by_id(&root_id).await).unwrap_or_default()
        }
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
    let accounts = state.accounts.lock().unwrap().clone();

    let event_id = EventId::parse(&id).map_err(|err| err.to_string())?;

    let authors: Vec<PublicKey> = accounts
        .iter()
        .map(|acc| PublicKey::from_str(acc).unwrap())
        .collect();

    let filter = Filter::new()
        .event(event_id)
        .kind(Kind::Repost)
        .authors(authors);

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
    let public_key = signer.public_key().await.map_err(|err| err.to_string())?;
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
        Ok(events) => Ok(process_event(client, events).await),
        Err(e) => Err(e.to_string()),
    }
}
