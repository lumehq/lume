use nostr_sdk::prelude::*;
use serde::Serialize;
use specta::Type;
use std::str::FromStr;
use tauri::State;

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
pub async fn get_all_relays(state: State<'_, Nostr>) -> Result<Vec<String>, String> {
    let client = &state.client;
    let relays = client.pool().all_relays().await;
    let v: Vec<String> = relays.iter().map(|item| item.0.to_string()).collect();

    Ok(v)
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_relay_lists(
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
