use crate::Nostr;
use nostr_sdk::prelude::*;
use std::time::Duration;
use tauri::State;

#[tauri::command(async)]
pub async fn get_event(id: &str, nostr: State<'_, Nostr>) -> Result<String, ()> {
  let client = &nostr.client;
  let event_id;

  if id.starts_with("note1") {
    event_id = EventId::from_bech32(id).unwrap();
  } else if id.starts_with("nevent1") {
    event_id = EventId::from_bech32(id).unwrap();
  } else if id.starts_with("naddr1") {
    event_id = EventId::from_bech32(id).unwrap();
  } else {
    event_id = EventId::from_hex(id).unwrap();
  }

  let filter = Filter::new().id(event_id);
  let events = client
    .get_events_of(vec![filter], Some(Duration::from_secs(10)))
    .await
    .expect("Get event failed");
  let event = events.first().unwrap().as_json();

  Ok(event)
}
