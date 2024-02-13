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

#[tauri::command(async)]
pub async fn create_profile(
  name: &str,
  display_name: &str,
  about: &str,
  picture: &str,
  banner: &str,
  nip05: &str,
  lud16: &str,
  website: &str,
  nostr: State<'_, Nostr>,
) -> Result<EventId, ()> {
  let client = &nostr.client;

  let metadata = Metadata::new()
    .name(name)
    .display_name(display_name)
    .about(about)
    .nip05(nip05)
    .lud16(lud16)
    .picture(Url::parse(picture).unwrap())
    .banner(Url::parse(banner).unwrap())
    .website(Url::parse(website).unwrap());

  if let Ok(event_id) = client.set_metadata(&metadata).await {
    Ok(event_id)
  } else {
    Err(())
  }
}
