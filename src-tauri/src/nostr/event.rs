use std::{str::FromStr, time::Duration};

use futures::future::join_all;
use nostr_sdk::prelude::*;
use serde::Serialize;
use specta::Type;
use tauri::State;

use crate::Nostr;
use crate::nostr::utils::{dedup_event, Meta, parse_event};

#[derive(Debug, Serialize, Type)]
pub struct RichEvent {
  pub raw: String,
  pub parsed: Option<Meta>,
}

#[tauri::command]
#[specta::specta]
pub async fn get_event(id: &str, state: State<'_, Nostr>) -> Result<RichEvent, String> {
  let client = &state.client;
  let event_id: Option<EventId> = match Nip19::from_bech32(id) {
    Ok(val) => match val {
      Nip19::EventId(id) => Some(id),
      Nip19::Event(event) => {
        let relays = event.relays;
        for relay in relays.into_iter() {
          let _ = client.add_relay(&relay).await.unwrap_or_default();
          client.connect_relay(&relay).await.unwrap_or_default();
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

      match client
        .get_events_of(vec![filter], Some(Duration::from_secs(10)))
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
    None => Err("Event ID is not valid.".into()),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn get_replies(id: &str, state: State<'_, Nostr>) -> Result<Vec<RichEvent>, String> {
  let client = &state.client;

  match EventId::from_hex(id) {
    Ok(event_id) => {
      let filter = Filter::new().kinds(vec![Kind::TextNote]).event(event_id);

      match client.get_events_of(vec![filter], None).await {
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
    Err(_) => Err("Event ID is not valid".into()),
  }
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
        Some(until) => Timestamp::from_str(until).unwrap(),
        None => Timestamp::now(),
      };
      let filter = Filter::new()
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .author(author)
        .limit(20)
        .until(until);

      match client.get_events_of(vec![filter], None).await {
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
  let contact_list = state.contact_list.lock().unwrap().clone();

  let as_of = match until {
    Some(until) => Timestamp::from_str(until).unwrap(),
    None => Timestamp::now(),
  };

  let authors: Vec<PublicKey> = contact_list.into_iter().map(|f| f.public_key).collect();

  let filter = Filter::new()
    .kinds(vec![Kind::TextNote, Kind::Repost])
    .limit(20)
    .until(as_of)
    .authors(authors);

  match client
    .get_events_of(vec![filter], Some(Duration::from_secs(10)))
    .await
  {
    Ok(events) => {
      let dedup = dedup_event(&events, false);

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
    Some(until) => Timestamp::from_str(until).unwrap(),
    None => Timestamp::now(),
  };

  let filter = Filter::new()
    .kinds(vec![Kind::TextNote, Kind::Repost])
    .limit(20)
    .until(as_of);

  match client
    .get_events_of(vec![filter], Some(Duration::from_secs(8)))
    .await
  {
    Ok(events) => {
      let dedup = dedup_event(&events, false);
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
    Some(until) => Timestamp::from_str(until).unwrap(),
    None => Timestamp::now(),
  };
  let filter = Filter::new()
    .kinds(vec![Kind::TextNote, Kind::Repost])
    .limit(20)
    .until(as_of)
    .hashtags(hashtags);

  match client.get_events_of(vec![filter], None).await {
    Ok(events) => {
      let dedup = dedup_event(&events, false);
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
#[specta::specta]
pub async fn repost(raw: &str, state: State<'_, Nostr>) -> Result<String, String> {
  let client = &state.client;
  let event = Event::from_json(raw).unwrap();

  match client.repost(&event, None).await {
    Ok(event_id) => Ok(event_id.to_string()),
    Err(err) => Err(err.to_string()),
  }
}
