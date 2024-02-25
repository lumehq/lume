use crate::Nostr;
use nostr_sdk::prelude::*;
use std::{str::FromStr, time::Duration};
use tauri::State;

#[tauri::command]
pub async fn get_event(id: &str, state: State<'_, Nostr>) -> Result<String, String> {
  let client = &state.client;
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
pub async fn get_local_events(
  limit: usize,
  until: Option<&str>,
  state: State<'_, Nostr>,
) -> Result<Vec<Event>, String> {
  let client = &state.client;
  let f_until = match until {
    Some(until) => Timestamp::from_str(until).unwrap(),
    None => Timestamp::now(),
  };

  let contact_list = client
    .get_contact_list_public_keys(Some(Duration::from_secs(10)))
    .await;

  if let Ok(authors) = contact_list {
    if authors.len() == 0 {
      return Err("Get text event failed".into());
    }

    let filter = Filter::new()
      .kinds(vec![Kind::TextNote, Kind::Repost])
      .authors(authors)
      .limit(limit)
      .until(f_until);

    if let Ok(events) = client
      .get_events_of(vec![filter], Some(Duration::from_secs(10)))
      .await
    {
      Ok(events)
    } else {
      Err("Get text event failed".into())
    }
  } else {
    Err("Get contact list failed".into())
  }
}

#[tauri::command]
pub async fn get_global_events(
  limit: usize,
  until: Option<&str>,
  state: State<'_, Nostr>,
) -> Result<Vec<Event>, String> {
  let client = &state.client;
  let f_until = match until {
    Some(until) => Timestamp::from_str(until).unwrap(),
    None => Timestamp::now(),
  };

  let filter = Filter::new()
    .kinds(vec![Kind::TextNote, Kind::Repost])
    .limit(limit)
    .until(f_until);

  if let Ok(events) = client
    .get_events_of(vec![filter], Some(Duration::from_secs(10)))
    .await
  {
    Ok(events)
  } else {
    Err("Get text event failed".into())
  }
}

#[tauri::command]
pub async fn get_event_thread(id: &str, state: State<'_, Nostr>) -> Result<Vec<Event>, ()> {
  let client = &state.client;
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
pub async fn publish(
  content: &str,
  tags: Vec<Vec<String>>,
  state: State<'_, Nostr>,
) -> Result<String, String> {
  let client = &state.client;
  let final_tags = tags.into_iter().map(|val| Tag::parse(val).unwrap());

  if let Ok(event_id) = client.publish_text_note(content, final_tags).await {
    Ok(event_id.to_bech32().unwrap())
  } else {
    Err("Publish text note failed".into())
  }
}

#[tauri::command]
pub async fn reply_to(
  content: &str,
  tags: Vec<String>,
  state: State<'_, Nostr>,
) -> Result<EventId, String> {
  let client = &state.client;
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
pub async fn repost(id: &str, pubkey: &str, state: State<'_, Nostr>) -> Result<EventId, ()> {
  let client = &state.client;
  let public_key = PublicKey::from_str(pubkey).unwrap();
  let event_id = EventId::from_hex(id).unwrap();

  let event = client
    .repost_event(event_id, public_key)
    .await
    .expect("Repost failed");

  Ok(event)
}

#[tauri::command]
pub async fn upvote(id: &str, pubkey: &str, state: State<'_, Nostr>) -> Result<EventId, ()> {
  let client = &state.client;
  let public_key = PublicKey::from_str(pubkey).unwrap();
  let event_id = EventId::from_hex(id).unwrap();

  let event = client
    .like(event_id, public_key)
    .await
    .expect("Upvote failed");

  Ok(event)
}

#[tauri::command]
pub async fn downvote(id: &str, pubkey: &str, state: State<'_, Nostr>) -> Result<EventId, ()> {
  let client = &state.client;
  let public_key = PublicKey::from_str(pubkey).unwrap();
  let event_id = EventId::from_hex(id).unwrap();

  let event = client
    .dislike(event_id, public_key)
    .await
    .expect("Downvote failed");

  Ok(event)
}
