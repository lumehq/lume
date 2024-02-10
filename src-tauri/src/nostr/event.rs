use crate::Nostr;
use nostr_sdk::prelude::*;
use std::{str::FromStr, time::Duration};
use tauri::State;

#[tauri::command(async)]
pub async fn get_event(id: &str, nostr: State<'_, Nostr>) -> Result<String, String> {
  let client = &nostr.client;
  let event_id;

  if id.starts_with("note") {
    event_id = EventId::from_bech32(id).unwrap();
  } else if id.starts_with("nevent") {
    event_id = Nip19Event::from_bech32(id).unwrap().event_id;
  } else {
    event_id = EventId::from_hex(id).unwrap();
  }

  let filter = Filter::new().id(event_id);
  let events = client
    .get_events_of(vec![filter], Some(Duration::from_secs(10)))
    .await
    .expect("Get event failed");

  if let Some(event) = events.first() {
    Ok(event.as_json())
  } else {
    Err("Event not found".into())
  }
}

#[tauri::command(async)]
pub async fn get_text_events(
  limit: usize,
  until: Option<String>,
  nostr: State<'_, Nostr>,
) -> Result<Vec<Event>, ()> {
  let client = &nostr.client;
  let contact_list = &nostr.contact_list.clone().unwrap();

  let authors: Vec<XOnlyPublicKey> = contact_list.into_iter().map(|x| x.pk).collect();
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
}

#[tauri::command(async)]
pub async fn get_event_thread(id: &str, nostr: State<'_, Nostr>) -> Result<Vec<Event>, ()> {
  let client = &nostr.client;
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

#[tauri::command(async)]
pub async fn publish(content: &str, nostr: State<'_, Nostr>) -> Result<EventId, ()> {
  let client = &nostr.client;

  let event = client
    .publish_text_note(content, [])
    .await
    .expect("Publish new text note failed");

  Ok(event)
}

#[tauri::command(async)]
pub async fn reply_to(
  content: &str,
  tags: Vec<String>,
  nostr: State<'_, Nostr>,
) -> Result<EventId, String> {
  let client = &nostr.client;

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

#[tauri::command(async)]
pub async fn repost(id: &str, pubkey: &str, nostr: State<'_, Nostr>) -> Result<EventId, ()> {
  let client = &nostr.client;
  let public_key = XOnlyPublicKey::from_str(pubkey).unwrap();
  let event_id = EventId::from_hex(id).unwrap();

  let event = client
    .repost_event(event_id, public_key)
    .await
    .expect("Repost failed");

  Ok(event)
}

#[tauri::command(async)]
pub async fn upvote(id: &str, pubkey: &str, nostr: State<'_, Nostr>) -> Result<EventId, ()> {
  let client = &nostr.client;
  let public_key = XOnlyPublicKey::from_str(pubkey).unwrap();
  let event_id = EventId::from_hex(id).unwrap();

  let event = client
    .like(event_id, public_key)
    .await
    .expect("Upvote failed");

  Ok(event)
}

#[tauri::command(async)]
pub async fn downvote(id: &str, pubkey: &str, nostr: State<'_, Nostr>) -> Result<EventId, ()> {
  let client = &nostr.client;
  let public_key = XOnlyPublicKey::from_str(pubkey).unwrap();
  let event_id = EventId::from_hex(id).unwrap();

  let event = client
    .dislike(event_id, public_key)
    .await
    .expect("Downvote failed");

  Ok(event)
}
