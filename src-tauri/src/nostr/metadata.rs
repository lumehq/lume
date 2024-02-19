use crate::NostrClient;
use nostr_sdk::prelude::*;
use std::{str::FromStr, time::Duration};
use tauri::State;

#[tauri::command]
pub async fn get_profile(id: &str, state: State<'_, NostrClient>) -> Result<Metadata, String> {
  let client = state.0.lock().await;
  let public_key: Option<PublicKey> = match Nip19::from_bech32(id) {
    Ok(val) => match val {
      Nip19::Pubkey(pubkey) => Some(pubkey),
      Nip19::Profile(profile) => Some(profile.public_key),
      _ => None,
    },
    Err(_) => match PublicKey::from_str(id) {
      Ok(val) => Some(val),
      Err(_) => None,
    },
  };

  if let Some(author) = public_key {
    let filter = Filter::new().author(author).kind(Kind::Metadata).limit(1);
    let events = client
      .get_events_of(vec![filter], Some(Duration::from_secs(10)))
      .await
      .expect("Get metadata failed");

    if let Some(event) = events.first() {
      let metadata: Metadata = Metadata::from_json(&event.content).unwrap();
      Ok(metadata)
    } else {
      let rand_metadata = Metadata::new();
      Ok(rand_metadata)
    }
  } else {
    Err("Public Key is not valid".into())
  }
}

#[tauri::command]
pub async fn get_contact_list(state: State<'_, NostrClient>) -> Result<Vec<String>, String> {
  let client = state.0.lock().await;
  let contact_list = client.get_contact_list(Some(Duration::from_secs(10))).await;

  if let Ok(list) = contact_list {
    let v = list.into_iter().map(|f| f.public_key.to_hex()).collect();
    Ok(v)
  } else {
    Err("Contact list not found".into())
  }
}

#[tauri::command]
pub async fn create_profile(
  name: &str,
  display_name: &str,
  about: &str,
  picture: &str,
  banner: &str,
  nip05: &str,
  lud16: &str,
  website: &str,
  state: State<'_, NostrClient>,
) -> Result<EventId, ()> {
  let client = state.0.lock().await;
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
