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
pub async fn get_events_from(
  id: &str,
  limit: usize,
  until: Option<&str>,
  state: State<'_, Nostr>,
) -> Result<Vec<Event>, String> {
  let client = &state.client;
  let f_until = match until {
    Some(until) => Timestamp::from_str(until).unwrap(),
    None => Timestamp::now(),
  };

  if let Ok(author) = PublicKey::from_str(id) {
    let filter = Filter::new()
      .kinds(vec![Kind::TextNote, Kind::Repost])
      .authors(vec![author])
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
    Err("Parse author failed".into())
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

      if let Ok(events) = client
        .get_events_of(vec![filter], Some(Duration::from_secs(15)))
        .await
      {
        println!("total global events: {}", events.len());
        Ok(events)
      } else {
        Err("Get events failed".into())
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
              .authors(val)
              .until(as_of);

            if let Ok(events) = client
              .get_events_of(vec![filter], Some(Duration::from_secs(15)))
              .await
            {
              println!("total local events: {}", events.len());
              Ok(events)
            } else {
              Err("Get events failed".into())
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
  global: Option<bool>,
  state: State<'_, Nostr>,
) -> Result<Vec<Event>, String> {
  let client = &state.client;
  let as_of = match until {
    Some(until) => Timestamp::from_str(until).unwrap(),
    None => Timestamp::now(),
  };
  let authors = match global {
    Some(val) => match val {
      true => None,
      false => {
        match client
          .get_contact_list_public_keys(Some(Duration::from_secs(10)))
          .await
        {
          Ok(val) => Some(val),
          Err(_) => None,
        }
      }
    },
    None => None,
  };
  let filter = match authors {
    Some(val) => Filter::new()
      .kinds(vec![Kind::TextNote, Kind::Repost])
      .authors(val)
      .limit(limit)
      .until(as_of)
      .hashtags(hashtags),
    None => Filter::new()
      .kinds(vec![Kind::TextNote, Kind::Repost])
      .limit(limit)
      .until(as_of)
      .hashtags(hashtags),
  };

  if let Ok(events) = client
    .get_events_of(vec![filter], Some(Duration::from_secs(15)))
    .await
  {
    println!("total events: {}", events.len());
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
  tags: Vec<Vec<&str>>,
  state: State<'_, Nostr>,
) -> Result<String, String> {
  let client = &state.client;
  let final_tags = tags.into_iter().map(|val| Tag::parse(&val).unwrap());

  match client.publish_text_note(content, final_tags).await {
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
