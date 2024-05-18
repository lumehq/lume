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
      Nip19::Event(event) => {
        let relays = event.relays;
        for relay in relays.into_iter() {
          let url = Url::from_str(&relay).unwrap();
          let _ = client.add_relay(url.clone()).await.unwrap_or_default();
          client.connect_relay(url).await.unwrap_or_default();
        }
        Some(event.event_id)
      }
      _ => None,
    },
    Err(_) => match EventId::from_hex(id) {
      Ok(val) => Some(val),
      Err(_) => None,
    },
  };

  match event_id {
    Some(id) => {
      let filter = Filter::new().id(id);

      match &client
        .get_events_of(vec![filter], Some(Duration::from_secs(10)))
        .await
      {
        Ok(events) => {
          if let Some(event) = events.first() {
            Ok(event.as_json())
          } else {
            Err("Cannot found this event with current relay list".into())
          }
        }
        Err(err) => Err(err.to_string()),
      }
    }
    None => Err("Event ID is not valid.".into()),
  }
}

#[tauri::command]
pub async fn get_events_from(
  public_key: &str,
  limit: usize,
  as_of: Option<&str>,
  state: State<'_, Nostr>,
) -> Result<Vec<Event>, String> {
  let client = &state.client;

  if let Ok(author) = PublicKey::from_str(public_key) {
    let until = match as_of {
      Some(until) => Timestamp::from_str(until).unwrap(),
      None => Timestamp::now(),
    };
    let filter = Filter::new()
      .kinds(vec![Kind::TextNote, Kind::Repost])
      .author(author)
      .limit(limit)
      .until(until);

    match client.get_events_of(vec![filter], None).await {
      Ok(events) => Ok(events),
      Err(err) => Err(err.to_string()),
    }
  } else {
    Err("Public Key is not valid, please check again.".into())
  }
}

#[tauri::command]
pub async fn get_events(
  limit: usize,
  until: Option<&str>,
  contacts: Option<Vec<&str>>,
  global: bool,
  state: State<'_, Nostr>,
) -> Result<Vec<Event>, String> {
  let client = &state.client;
  let as_of = match until {
    Some(until) => Timestamp::from_str(until).unwrap(),
    None => Timestamp::now(),
  };

  match global {
    true => {
      let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(limit)
        .until(as_of);

      match client
        .get_events_of(vec![filter], Some(Duration::from_secs(15)))
        .await
      {
        Ok(events) => Ok(events),
        Err(err) => Err(err.to_string()),
      }
    }
    false => {
      let authors = match contacts {
        Some(val) => {
          let c: Vec<PublicKey> = val
            .into_iter()
            .map(|key| PublicKey::from_str(key).unwrap())
            .collect();
          Some(c)
        }
        None => {
          match client
            .get_contact_list_public_keys(Some(Duration::from_secs(10)))
            .await
          {
            Ok(val) => Some(val),
            Err(_) => None,
          }
        }
      };

      match authors {
        Some(val) => {
          if val.is_empty() {
            Err("Get local events but contact list is empty".into())
          } else {
            let filter = Filter::new()
              .kinds(vec![Kind::TextNote, Kind::Repost])
              .limit(limit)
              .authors(val.clone())
              .until(as_of);

            match client.get_events_of(vec![filter], None).await {
              Ok(events) => Ok(events),
              Err(err) => Err(err.to_string()),
            }
          }
        }
        None => Err("Get local events but contact list is empty".into()),
      }
    }
  }
}

#[tauri::command]
pub async fn get_events_from_interests(
  hashtags: Vec<&str>,
  limit: usize,
  until: Option<&str>,
  state: State<'_, Nostr>,
) -> Result<Vec<Event>, String> {
  let client = &state.client;
  let as_of = match until {
    Some(until) => Timestamp::from_str(until).unwrap(),
    None => Timestamp::now(),
  };
  let filter = Filter::new()
    .kinds(vec![Kind::TextNote, Kind::Repost])
    .limit(limit)
    .until(as_of)
    .hashtags(hashtags);

  match client.get_events_of(vec![filter], None).await {
    Ok(events) => Ok(events),
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command]
pub async fn get_event_thread(id: &str, state: State<'_, Nostr>) -> Result<Vec<Event>, String> {
  let client = &state.client;

  match EventId::from_hex(id) {
    Ok(event_id) => {
      let filter = Filter::new().kinds(vec![Kind::TextNote]).event(event_id);

      match client.get_events_of(vec![filter], None).await {
        Ok(events) => Ok(events),
        Err(err) => Err(err.to_string()),
      }
    }
    Err(_) => Err("Event ID is not valid".into()),
  }
}

#[tauri::command]
pub async fn publish(
  content: &str,
  tags: Vec<Vec<&str>>,
  state: State<'_, Nostr>,
) -> Result<String, String> {
  let client = &state.client;
  let event_tags = tags.into_iter().map(|val| Tag::parse(&val).unwrap());

  match client.publish_text_note(content, event_tags).await {
    Ok(event_id) => Ok(event_id.to_bech32().unwrap()),
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command]
pub async fn repost(raw: &str, state: State<'_, Nostr>) -> Result<EventId, String> {
  let client = &state.client;
  let event = Event::from_json(raw).unwrap();

  if let Ok(event_id) = client.repost(&event, None).await {
    Ok(event_id)
  } else {
    Err("Repost failed".into())
  }
}
