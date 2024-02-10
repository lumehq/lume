use crate::Nostr;
use nostr_sdk::prelude::*;
use std::{str::FromStr, time::Duration};
use tauri::State;

#[tauri::command(async)]
pub async fn get_profile(id: &str, nostr: State<'_, Nostr>) -> Result<Metadata, ()> {
  let client = &nostr.client;
  let public_key;

  if id.starts_with("nprofile1") {
    public_key = XOnlyPublicKey::from_bech32(id).unwrap();
  } else if id.starts_with("npub1") {
    public_key = XOnlyPublicKey::from_bech32(id).unwrap();
  } else {
    public_key = XOnlyPublicKey::from_str(id).unwrap();
  }

  let filter = Filter::new()
    .author(public_key)
    .kind(Kind::Metadata)
    .limit(1);

  let events = client
    .get_events_of(vec![filter], Some(Duration::from_secs(10)))
    .await
    .expect("Get metadata failed");

  if let Some(event) = events.first() {
    let metadata: Metadata = Metadata::from_json(&event.content).unwrap();
    Ok(metadata)
  } else {
    Err(())
  }
}
