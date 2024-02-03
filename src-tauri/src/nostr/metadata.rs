use crate::AppState;
use nostr_sdk::prelude::*;
use std::time::Duration;
use tauri::State;

#[tauri::command(async)]
pub async fn get_metadata(npub: String, app_state: State<'_, AppState>) -> Result<Metadata, ()> {
  let client = &app_state.nostr;

  let public_key = XOnlyPublicKey::from_bech32(npub).unwrap();

  let filter = Filter::new()
    .author(public_key)
    .kind(Kind::Metadata)
    .limit(1);

  let events = client
    .get_events_of(vec![filter], Some(Duration::from_secs(10)))
    .await
    .expect("Get metadata failed");

  let event = events.into_iter().nth(0).unwrap();
  let metadata: Metadata = Metadata::from_json(&event.content).unwrap();

  Ok(metadata)
}
