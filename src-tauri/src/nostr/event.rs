use crate::NostrClient;
use nostr_sdk::prelude::*;
use std::{str::FromStr, time::Duration};
use tauri::State;

#[tauri::command]
pub async fn get_event(id: &str, state: State<'_, NostrClient>) -> Result<String, String> {
  let client = state.0.lock().await;
  let event_id: Option<EventId> = match Nip19::from_bech32(id) {
    Ok(val) => match val {
      Nip19::EventId(id) => Some(id),
      Nip19::Event(event) => Some(event.event_id),
      _ => None,
    },
    Err(_) => match EventId::from_hex(id) {
      Ok(val) => Some(val),
      Err(_) => None,
    },
  };

  if let Some(id) = event_id {
    let filter = Filter::new().id(id);

    if let Ok(events) = &client
      .get_events_of(vec![filter], Some(Duration::from_secs(10)))
      .await
    {
      if let Some(event) = events.first() {
        Ok(event.as_json())
      } else {
        Err("Event not found with current relay list".into())
      }
    } else {
      Err("Event not found with current relay list".into())
    }
  } else {
    Err("EventId is not valid".into())
  }
}

#[tauri::command]
pub async fn get_text_events(
  limit: usize,
  until: Option<&str>,
  contact_list: Option<Vec<&str>>,
  state: State<'_, NostrClient>,
) -> Result<Vec<Event>, ()> {
  let client = state.0.lock().await;

  if let Some(list) = contact_list {
    let authors: Vec<PublicKey> = list
      .into_iter()
      .map(|x| PublicKey::from_str(x).unwrap())
      .collect();
    let mut final_until = Timestamp::now();

    if let Some(t) = until {
      final_until = Timestamp::from_str(&t).unwrap();
    }

    let filter = Filter::new()
      .kinds(vec![Kind::TextNote, Kind::Repost])
      .authors(authors)
      .limit(limit)
      .until(final_until);

    if let Ok(events) = client
      .get_events_of(vec![filter], Some(Duration::from_secs(10)))
      .await
    {
      Ok(events)
    } else {
      Err(())
    }
  } else {
    Err(())
  }
}

#[tauri::command]
pub async fn get_event_thread(id: &str, state: State<'_, NostrClient>) -> Result<Vec<Event>, ()> {
  let client = state.0.lock().await;
  let event_id = EventId::from_hex(id).unwrap();
  let filter = Filter::new().kinds(vec![Kind::TextNote]).event(event_id);

  if let Ok(events) = client
    .get_events_of(vec![filter], Some(Duration::from_secs(10)))
    .await
  {
    Ok(events)
  } else {
    Err(())
  }
}

#[tauri::command]
pub async fn publish(content: &str, state: State<'_, NostrClient>) -> Result<EventId, ()> {
  let client = state.0.lock().await;
  let event = client
    .publish_text_note(content, [])
    .await
    .expect("Publish new text note failed");

  Ok(event)
}

#[tauri::command]
pub async fn reply_to(
  content: &str,
  tags: Vec<String>,
  state: State<'_, NostrClient>,
) -> Result<EventId, String> {
  let client = state.0.lock().await;
  if let Ok(event_tags) = Tag::parse(tags) {
    let event = client
      .publish_text_note(content, vec![event_tags])
      .await
      .expect("Publish reply failed");

    Ok(event)
  } else {
    Err("Reply failed".into())
  }
}

#[tauri::command]
pub async fn repost(id: &str, pubkey: &str, state: State<'_, NostrClient>) -> Result<EventId, ()> {
  let client = state.0.lock().await;
  let public_key = PublicKey::from_str(pubkey).unwrap();
  let event_id = EventId::from_hex(id).unwrap();

  let event = client
    .repost_event(event_id, public_key)
    .await
    .expect("Repost failed");

  Ok(event)
}

#[tauri::command]
pub async fn upvote(id: &str, pubkey: &str, state: State<'_, NostrClient>) -> Result<EventId, ()> {
  let client = state.0.lock().await;
  let public_key = PublicKey::from_str(pubkey).unwrap();
  let event_id = EventId::from_hex(id).unwrap();

  let event = client
    .like(event_id, public_key)
    .await
    .expect("Upvote failed");

  Ok(event)
}

#[tauri::command]
pub async fn downvote(
  id: &str,
  pubkey: &str,
  state: State<'_, NostrClient>,
) -> Result<EventId, ()> {
  let client = state.0.lock().await;
  let public_key = PublicKey::from_str(pubkey).unwrap();
  let event_id = EventId::from_hex(id).unwrap();

  let event = client
    .dislike(event_id, public_key)
    .await
    .expect("Downvote failed");

  Ok(event)
}
