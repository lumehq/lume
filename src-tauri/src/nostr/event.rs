use crate::AppState;
use nostr_sdk::prelude::*;
use std::time::Duration;
use tauri::State;

#[tauri::command(async)]
pub async fn get_event(id: String, app_state: State<'_, AppState>) -> Result<String, ()> {
  let client = &app_state.nostr;

  let event_id = EventId::from_bech32(id).unwrap();
  let filter = Filter::new().id(event_id);

  let events = client
    .get_events_of(vec![filter], Some(Duration::from_secs(10)))
    .await
    .expect("Get metadata failed");
  let event = events.into_iter().nth(0).unwrap().as_json();

  Ok(event)
}
