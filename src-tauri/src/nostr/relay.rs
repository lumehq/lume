use crate::Nostr;
use nostr_sdk::prelude::*;
use serde::Serialize;
use specta::Type;
use std::{
  fs::OpenOptions,
  io::{self, BufRead, Write},
};
use tauri::{path::BaseDirectory, Manager, State};

#[derive(Serialize, Type)]
pub struct Relays {
  connected: Vec<String>,
  read: Option<Vec<String>>,
  write: Option<Vec<String>>,
  both: Option<Vec<String>>,
}

#[tauri::command]
#[specta::specta]
pub async fn get_relays(state: State<'_, Nostr>) -> Result<Relays, String> {
  let client = &state.client;

  let connected_relays = client
    .relays()
    .await
    .into_keys()
    .map(|url| url.to_string())
    .collect::<Vec<_>>();

  let signer = client.signer().await.map_err(|e| e.to_string())?;
  let public_key = signer.public_key().await.map_err(|e| e.to_string())?;

  let filter = Filter::new()
    .author(public_key)
    .kind(Kind::RelayList)
    .limit(1);

  match client.get_events_of(vec![filter], None).await {
    Ok(events) => {
      if let Some(event) = events.first() {
        let nip65_list = nip65::extract_relay_list(event).collect::<Vec<_>>();

        let read = nip65_list
          .iter()
          .filter_map(|(url, meta)| {
            if let Some(RelayMetadata::Read) = meta {
              Some(url.to_string())
            } else {
              None
            }
          })
          .collect();

        let write = nip65_list
          .iter()
          .filter_map(|(url, meta)| {
            if let Some(RelayMetadata::Write) = meta {
              Some(url.to_string())
            } else {
              None
            }
          })
          .collect();

        let both = nip65_list
          .iter()
          .filter_map(|(url, meta)| {
            if meta.is_none() {
              Some(url.to_string())
            } else {
              None
            }
          })
          .collect();

        Ok(Relays {
          connected: connected_relays,
          read: Some(read),
          write: Some(write),
          both: Some(both),
        })
      } else {
        Ok(Relays {
          connected: connected_relays,
          read: None,
          write: None,
          both: None,
        })
      }
    }
    Err(e) => Err(e.to_string()),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn connect_relay(relay: &str, state: State<'_, Nostr>) -> Result<bool, String> {
  let client = &state.client;
  let status = client.add_relay(relay).await.map_err(|e| e.to_string())?;
  if status {
    println!("Connecting to relay: {}", relay);
    client
      .connect_relay(relay)
      .await
      .map_err(|e| e.to_string())?;
  }
  Ok(status)
}

#[tauri::command]
#[specta::specta]
pub async fn remove_relay(relay: &str, state: State<'_, Nostr>) -> Result<bool, String> {
  let client = &state.client;
  client
    .remove_relay(relay)
    .await
    .map_err(|e| e.to_string())?;
  client
    .disconnect_relay(relay)
    .await
    .map_err(|e| e.to_string())?;
  Ok(true)
}

#[tauri::command]
#[specta::specta]
pub fn get_bootstrap_relays(app: tauri::AppHandle) -> Result<Vec<String>, String> {
  let relays_path = app
    .path()
    .resolve("resources/relays.txt", BaseDirectory::Resource)
    .map_err(|e| e.to_string())?;

  let file = std::fs::File::open(relays_path).map_err(|e| e.to_string())?;
  let reader = io::BufReader::new(file);

  reader
    .lines()
    .collect::<Result<Vec<String>, io::Error>>()
    .map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn save_bootstrap_relays(relays: &str, app: tauri::AppHandle) -> Result<(), String> {
  let relays_path = app
    .path()
    .resolve("resources/relays.txt", BaseDirectory::Resource)
    .map_err(|e| e.to_string())?;

  let mut file = OpenOptions::new()
    .write(true)
    .open(relays_path)
    .map_err(|e| e.to_string())?;

  file.write_all(relays.as_bytes()).map_err(|e| e.to_string())
}
