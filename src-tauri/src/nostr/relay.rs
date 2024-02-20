use crate::Nostr;
use nostr_sdk::prelude::*;
use tauri::State;

#[tauri::command]
pub async fn list_connected_relays(state: State<'_, Nostr>) -> Result<Vec<Url>, ()> {
  let client = state.client.lock().await;
  let relays = client.relays().await;
  let list: Vec<Url> = relays.into_keys().collect();

  Ok(list)
}

#[tauri::command]
pub async fn connect_relay(relay: &str, state: State<'_, Nostr>) -> Result<bool, ()> {
  let client = state.client.lock().await;
  if let Ok(_) = client.add_relay(relay).await {
    Ok(true)
  } else {
    Ok(false)
  }
}

#[tauri::command]
pub async fn remove_relay(relay: &str, state: State<'_, Nostr>) -> Result<bool, ()> {
  let client = state.client.lock().await;
  if let Ok(_) = client.remove_relay(relay).await {
    Ok(true)
  } else {
    Ok(false)
  }
}
