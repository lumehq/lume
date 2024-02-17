use crate::Nostr;
use nostr_sdk::prelude::*;
use tauri::State;

#[tauri::command]
pub async fn list_connected_relays(nostr: State<'_, Nostr>) -> Result<Vec<Url>, ()> {
  let client = &nostr.client;
  let relays = client.relays().await;
  let list: Vec<Url> = relays.into_keys().collect();

  Ok(list)
}

#[tauri::command]
pub async fn connect_relay(relay: &str, nostr: State<'_, Nostr>) -> Result<bool, ()> {
  let client = &nostr.client;
  if let Ok(_) = client.add_relay(relay).await {
    Ok(true)
  } else {
    Ok(false)
  }
}

#[tauri::command]
pub async fn remove_relay(relay: &str, nostr: State<'_, Nostr>) -> Result<bool, ()> {
  let client = &nostr.client;
  if let Ok(_) = client.remove_relay(relay).await {
    Ok(true)
  } else {
    Ok(false)
  }
}
