use std::{
  fs,
  io::{self, BufRead, Write},
};

use crate::Nostr;
use nostr_sdk::prelude::*;
use serde::Serialize;
use specta::Type;
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
pub async fn get_relays(state: State<'_, Nostr>) -> Result<Relays, ()> {
  let client = &state.client;

  // Get connected relays
  let list = client.relays().await;
  let connected_relays: Vec<String> = list.into_keys().map(|url| url.to_string()).collect();

  // Get NIP-65 relay list
  let signer = client.signer().await.unwrap();
  let public_key = signer.public_key().await.unwrap();
  let filter = Filter::new()
    .author(public_key)
    .kind(Kind::RelayList)
    .limit(1);

  match client.get_events_of(vec![filter], None).await {
    Ok(events) => {
      if let Some(event) = events.first() {
        let nip65_list = nip65::extract_relay_list(event);
        let read: Vec<String> = nip65_list
          .clone()
          .into_iter()
          .filter(|i| matches!(&i.1, Some(y) if *y == RelayMetadata::Read))
          .map(|(url, _)| url.to_string())
          .collect();
        let write: Vec<String> = nip65_list
          .clone()
          .into_iter()
          .filter(|i| matches!(&i.1, Some(y) if *y == RelayMetadata::Write))
          .map(|(url, _)| url.to_string())
          .collect();
        let both: Vec<String> = nip65_list
          .into_iter()
          .filter(|i| i.1.is_none())
          .map(|(url, _)| url.to_string())
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
    Err(_) => Ok(Relays {
      connected: connected_relays,
      read: None,
      write: None,
      both: None,
    }),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn connect_relay(relay: &str, state: State<'_, Nostr>) -> Result<bool, ()> {
  let client = &state.client;
  if let Ok(status) = client.add_relay(relay).await {
    if status {
      println!("connecting to relay: {}", relay);
      let _ = client.connect_relay(relay).await;
      Ok(true)
    } else {
      Ok(false)
    }
  } else {
    Ok(false)
  }
}

#[tauri::command]
#[specta::specta]
pub async fn remove_relay(relay: &str, state: State<'_, Nostr>) -> Result<bool, ()> {
  let client = &state.client;
  if (client.remove_relay(relay).await).is_ok() {
    let _ = client.disconnect_relay(relay).await;
    Ok(true)
  } else {
    Ok(false)
  }
}

#[tauri::command]
#[specta::specta]
pub fn get_bootstrap_relays(app: tauri::AppHandle) -> Result<Vec<String>, ()> {
  let relays_path = app
    .path()
    .resolve("resources/relays.txt", BaseDirectory::Resource)
    .expect("Bootstrap relays not found.");

  let file = std::fs::File::open(&relays_path).unwrap();
  let lines = io::BufReader::new(file).lines();

  let mut relays = Vec::new();

  for line in lines.flatten() {
    relays.push(line.to_string())
  }

  Ok(relays)
}

#[tauri::command]
#[specta::specta]
pub fn save_bootstrap_relays(relays: &str, app: tauri::AppHandle) -> Result<(), String> {
  let relays_path = app
    .path()
    .resolve("resources/relays.txt", BaseDirectory::Resource)
    .expect("Bootstrap relays not found.");

  let mut file = fs::OpenOptions::new()
    .write(true)
    .open(&relays_path)
    .unwrap();

  match file.write_all(relays.as_bytes()) {
    Ok(_) => Ok(()),
    Err(_) => Err("Cannot save bootstrap relays, please try again later.".into()),
  }
}
