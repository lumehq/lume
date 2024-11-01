use nostr_sdk::prelude::*;
use serde::Serialize;
use specta::Type;
use std::{
    fs::OpenOptions,
    io::{self, BufRead, Write},
    str::FromStr,
};
use tauri::{path::BaseDirectory, Manager, State};

use crate::{Nostr, FETCH_LIMIT};

#[derive(Serialize, Type)]
pub struct Relays {
    connected: Vec<String>,
    read: Option<Vec<String>>,
    write: Option<Vec<String>>,
    both: Option<Vec<String>>,
}

#[tauri::command]
#[specta::specta]
pub async fn get_relays(id: String, state: State<'_, Nostr>) -> Result<Relays, String> {
    let client = &state.client;
    let public_key = PublicKey::from_str(&id).map_err(|e| e.to_string())?;

    let connected_relays = client
        .relays()
        .await
        .into_keys()
        .map(|url| url.to_string())
        .collect::<Vec<_>>();

    let filter = Filter::new()
        .author(public_key)
        .kind(Kind::RelayList)
        .limit(1);

    match client.database().query(vec![filter]).await {
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
pub async fn get_all_relays(
    until: Option<String>,
    state: State<'_, Nostr>,
) -> Result<Vec<String>, String> {
    let client = &state.client;

    let as_of = match until {
        Some(until) => Timestamp::from_str(&until).unwrap_or(Timestamp::now()),
        None => Timestamp::now(),
    };

    let filter = Filter::new()
        .kind(Kind::RelayList)
        .limit(FETCH_LIMIT)
        .until(as_of);

    let events = client
        .database()
        .query(vec![filter])
        .await
        .map_err(|e| e.to_string())?;

    let alt_events: Vec<String> = events.iter().map(|ev| ev.as_json()).collect();

    Ok(alt_events)
}

#[tauri::command]
#[specta::specta]
pub async fn is_relay_connected(relay: String, state: State<'_, Nostr>) -> Result<bool, String> {
    let client = &state.client;
    let status = client.add_relay(&relay).await.map_err(|e| e.to_string())?;

    Ok(status)
}

#[tauri::command]
#[specta::specta]
pub async fn connect_relay(relay: String, state: State<'_, Nostr>) -> Result<(), String> {
    let client = &state.client;
    let _ = client.add_relay(&relay).await;
    let _ = client.connect_relay(&relay).await;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn remove_relay(relay: String, state: State<'_, Nostr>) -> Result<(), String> {
    let client = &state.client;
    let _ = client.force_remove_relay(relay).await;

    Ok(())
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
pub fn set_bootstrap_relays(relays: String, app: tauri::AppHandle) -> Result<(), String> {
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
