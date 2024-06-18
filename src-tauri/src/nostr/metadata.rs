use std::{str::FromStr, time::Duration};

use keyring::Entry;
use nostr_sdk::prelude::*;
use tauri::State;

use crate::{Nostr, Settings};

use super::get_latest_event;

#[tauri::command]
#[specta::specta]
pub async fn get_current_profile(state: State<'_, Nostr>) -> Result<String, String> {
  let client = &state.client;

  let signer = match client.signer().await {
    Ok(signer) => signer,
    Err(err) => return Err(format!("Failed to get signer: {}", err)),
  };

  let public_key = match signer.public_key().await {
    Ok(pk) => pk,
    Err(err) => return Err(format!("Failed to get public key: {}", err)),
  };

  let filter = Filter::new()
    .author(public_key)
    .kind(Kind::Metadata)
    .limit(1);

  let events_result = client
    .get_events_of(vec![filter], Some(Duration::from_secs(10)))
    .await;

  match events_result {
    Ok(events) => {
      if let Some(event) = get_latest_event(&events) {
        match Metadata::from_json(&event.content) {
          Ok(metadata) => Ok(metadata.as_json()),
          Err(_) => Err("Failed to parse metadata.".into()),
        }
      } else {
        Err("No matching events found.".into())
      }
    }
    Err(err) => Err(format!("Failed to get events: {}", err)),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn get_profile(id: &str, state: State<'_, Nostr>) -> Result<String, String> {
  let client = &state.client;
  let public_key: Option<PublicKey> = match Nip19::from_bech32(id) {
    Ok(val) => match val {
      Nip19::Pubkey(key) => Some(key),
      Nip19::Profile(profile) => {
        let relays = profile.relays;
        for relay in relays.into_iter() {
          let _ = client.add_relay(&relay).await.unwrap_or_default();
          client.connect_relay(&relay).await.unwrap_or_default();
        }
        Some(profile.public_key)
      }
      _ => None,
    },
    Err(_) => match PublicKey::from_str(id) {
      Ok(val) => Some(val),
      Err(_) => None,
    },
  };

  if let Some(author) = public_key {
    let filter = Filter::new().author(author).kind(Kind::Metadata).limit(1);
    let query = client
      .get_events_of(vec![filter], Some(Duration::from_secs(10)))
      .await;

    if let Ok(events) = query {
      if let Some(event) = events.first() {
        if let Ok(metadata) = Metadata::from_json(&event.content) {
          Ok(metadata.as_json())
        } else {
          Err("Parse metadata failed".into())
        }
      } else {
        let rand_metadata = Metadata::new();
        Ok(rand_metadata.as_json())
      }
    } else {
      Err("Get metadata failed".into())
    }
  } else {
    Err("Public Key is not valid".into())
  }
}

#[tauri::command]
#[specta::specta]
pub async fn set_contact_list(
  public_keys: Vec<&str>,
  state: State<'_, Nostr>,
) -> Result<bool, String> {
  let client = &state.client;
  let contact_list: Vec<Contact> = public_keys
    .into_iter()
    .filter_map(|p| match PublicKey::from_hex(p) {
      Ok(pk) => Some(Contact::new(pk, None, Some(""))),
      Err(_) => None,
    })
    .collect();

  match client.set_contact_list(contact_list).await {
    Ok(_) => Ok(true),
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn get_contact_list(state: State<'_, Nostr>) -> Result<Vec<String>, String> {
  let client = &state.client;

  match client.get_contact_list(Some(Duration::from_secs(10))).await {
    Ok(contact_list) => {
      if !contact_list.is_empty() {
        let list = contact_list
          .into_iter()
          .map(|f| f.public_key.to_hex())
          .collect();

        Ok(list)
      } else {
        Err("Empty.".into())
      }
    }
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn create_profile(
  name: &str,
  display_name: &str,
  about: &str,
  picture: &str,
  banner: &str,
  nip05: &str,
  lud16: &str,
  website: &str,
  state: State<'_, Nostr>,
) -> Result<String, String> {
  let client = &state.client;
  let mut metadata = Metadata::new()
    .name(name)
    .display_name(display_name)
    .about(about)
    .nip05(nip05)
    .lud16(lud16);

  if let Ok(url) = Url::parse(picture) {
    metadata = metadata.picture(url)
  }

  if let Ok(url) = Url::parse(banner) {
    metadata = metadata.banner(url)
  }

  if let Ok(url) = Url::parse(website) {
    metadata = metadata.website(url)
  }

  if let Ok(event_id) = client.set_metadata(&metadata).await {
    Ok(event_id.to_string())
  } else {
    Err("Create profile failed".into())
  }
}

#[tauri::command]
#[specta::specta]
pub async fn is_contact_list_empty(state: State<'_, Nostr>) -> Result<bool, ()> {
  let contact_list = state.contact_list.lock().unwrap();
  Ok(contact_list.is_empty())
}

#[tauri::command]
#[specta::specta]
pub async fn check_contact(hex: &str, state: State<'_, Nostr>) -> Result<bool, ()> {
  let contact_list = state.contact_list.lock().unwrap();
  let public_key = PublicKey::from_str(hex).unwrap();

  match contact_list.iter().position(|x| x.public_key == public_key) {
    Some(_) => Ok(true),
    None => Ok(false),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn toggle_contact(
  hex: &str,
  alias: Option<&str>,
  state: State<'_, Nostr>,
) -> Result<String, String> {
  let client = &state.client;

  match client.get_contact_list(None).await {
    Ok(mut contact_list) => {
      let public_key = PublicKey::from_str(hex).unwrap();

      match contact_list.iter().position(|x| x.public_key == public_key) {
        Some(index) => {
          // Remove contact
          contact_list.remove(index);
        }
        None => {
          // TODO: Add relay_url
          let new_contact = Contact::new(public_key, None, alias);
          // Add new contact
          contact_list.push(new_contact);
        }
      }

      // Update local state
      state.contact_list.lock().unwrap().clone_from(&contact_list);

      // Publish
      match client.set_contact_list(contact_list).await {
        Ok(event_id) => Ok(event_id.to_string()),
        Err(err) => Err(err.to_string()),
      }
    }
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn set_nstore(
  key: &str,
  content: &str,
  state: State<'_, Nostr>,
) -> Result<String, String> {
  let client = &state.client;

  match client.signer().await {
    Ok(signer) => {
      let public_key = match signer.public_key().await {
        Ok(pk) => pk,
        Err(err) => return Err(format!("Failed to get public key: {}", err)),
      };

      let encrypted = match signer.nip44_encrypt(public_key, content).await {
        Ok(enc) => enc,
        Err(err) => return Err(format!("Encryption failed: {}", err)),
      };

      let tag = Tag::identifier(key);
      let builder = EventBuilder::new(Kind::ApplicationSpecificData, encrypted, vec![tag]);

      match client.send_event_builder(builder).await {
        Ok(event_id) => Ok(event_id.to_string()),
        Err(err) => Err(err.to_string()),
      }
    }
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn get_nstore(key: &str, state: State<'_, Nostr>) -> Result<String, String> {
  let client = &state.client;

  if let Ok(signer) = client.signer().await {
    let public_key = match signer.public_key().await {
      Ok(pk) => pk,
      Err(err) => return Err(format!("Failed to get public key: {}", err)),
    };

    let filter = Filter::new()
      .author(public_key)
      .kind(Kind::ApplicationSpecificData)
      .identifier(key)
      .limit(1);

    match client
      .get_events_of(vec![filter], Some(Duration::from_secs(5)))
      .await
    {
      Ok(events) => {
        if let Some(event) = events.first() {
          let content = event.content();
          match signer.nip44_decrypt(public_key, content).await {
            Ok(decrypted) => Ok(decrypted),
            Err(_) => Err(event.content.to_string()),
          }
        } else {
          Err("Value not found".into())
        }
      }
      Err(err) => Err(err.to_string()),
    }
  } else {
    Err("Signer is required".into())
  }
}

#[tauri::command]
#[specta::specta]
pub async fn set_nwc(uri: &str, state: State<'_, Nostr>) -> Result<bool, String> {
  let client = &state.client;

  if let Ok(nwc_uri) = NostrWalletConnectURI::from_str(uri) {
    let nwc = NWC::new(nwc_uri);
    let keyring = Entry::new("Lume Secret Storage", "NWC").map_err(|e| e.to_string())?;
    keyring.set_password(uri).map_err(|e| e.to_string())?;
    client.set_zapper(nwc).await;

    Ok(true)
  } else {
    Err("Set NWC failed".into())
  }
}

#[tauri::command]
#[specta::specta]
pub async fn load_nwc(state: State<'_, Nostr>) -> Result<bool, String> {
  let client = &state.client;
  let keyring = Entry::new("Lume Secret Storage", "NWC").map_err(|e| e.to_string())?;

  match keyring.get_password() {
    Ok(val) => {
      let uri = NostrWalletConnectURI::from_str(&val).map_err(|e| e.to_string())?;
      let nwc = NWC::new(uri);
      client.set_zapper(nwc).await;

      Ok(true)
    }
    Err(_) => Ok(false),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn get_balance() -> Result<String, String> {
  let keyring = Entry::new("Lume Secret Storage", "NWC").map_err(|e| e.to_string())?;

  match keyring.get_password() {
    Ok(val) => {
      let uri = NostrWalletConnectURI::from_str(&val).map_err(|e| e.to_string())?;
      let nwc = NWC::new(uri);
      nwc
        .get_balance()
        .await
        .map(|balance| balance.to_string())
        .map_err(|_| "Get balance failed".into())
    }
    Err(_) => Err("Something wrong".into()),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn zap_profile(
  id: &str,
  amount: &str,
  message: &str,
  state: State<'_, Nostr>,
) -> Result<bool, String> {
  let client = &state.client;
  let public_key: Option<PublicKey> = match Nip19::from_bech32(id) {
    Ok(val) => match val {
      Nip19::Pubkey(key) => Some(key),
      Nip19::Profile(profile) => Some(profile.public_key),
      _ => None,
    },
    Err(_) => match PublicKey::from_str(id) {
      Ok(val) => Some(val),
      Err(_) => None,
    },
  };

  if let Some(recipient) = public_key {
    let details = ZapDetails::new(ZapType::Public).message(message);
    let num = match amount.parse::<u64>() {
      Ok(val) => val,
      Err(_) => return Err("Invalid amount.".into()),
    };

    if client.zap(recipient, num, Some(details)).await.is_ok() {
      Ok(true)
    } else {
      Err("Zap profile failed".into())
    }
  } else {
    Err("Parse public key failed".into())
  }
}

#[tauri::command]
#[specta::specta]
pub async fn zap_event(
  id: &str,
  amount: &str,
  message: &str,
  state: State<'_, Nostr>,
) -> Result<bool, String> {
  let client = &state.client;
  let event_id: Option<EventId> = match Nip19::from_bech32(id) {
    Ok(val) => match val {
      Nip19::EventId(id) => Some(id),
      Nip19::Event(event) => Some(event.event_id),
      _ => None,
    },
    Err(_) => match EventId::from_hex(id) {
      Ok(val) => Some(val),
      Err(_) => None,
    },
  };

  if let Some(recipient) = event_id {
    let details = ZapDetails::new(ZapType::Public).message(message);
    let num = match amount.parse::<u64>() {
      Ok(val) => val,
      Err(_) => return Err("Invalid amount.".into()),
    };

    if client.zap(recipient, num, Some(details)).await.is_ok() {
      Ok(true)
    } else {
      Err("Zap event failed".into())
    }
  } else {
    Err("Parse event ID failed".into())
  }
}

#[tauri::command]
#[specta::specta]
pub async fn friend_to_friend(npub: &str, state: State<'_, Nostr>) -> Result<bool, String> {
  let client = &state.client;

  match PublicKey::from_bech32(npub) {
    Ok(author) => {
      let mut contact_list: Vec<Contact> = Vec::new();
      let contact_list_filter = Filter::new()
        .author(author)
        .kind(Kind::ContactList)
        .limit(1);

      if let Ok(contact_list_events) = client.get_events_of(vec![contact_list_filter], None).await {
        for event in contact_list_events.into_iter() {
          for tag in event.into_iter_tags() {
            if let Some(TagStandard::PublicKey {
              public_key,
              relay_url,
              alias,
              uppercase: false,
            }) = tag.to_standardized()
            {
              contact_list.push(Contact::new(public_key, relay_url, alias))
            }
          }
        }
      }

      match client.set_contact_list(contact_list).await {
        Ok(_) => Ok(true),
        Err(err) => Err(err.to_string()),
      }
    }
    Err(err) => Err(err.to_string()),
  }
}

pub async fn get_following(
  state: State<'_, Nostr>,
  public_key: &str,
  timeout: Option<u64>,
) -> Result<Vec<String>, String> {
  let client = &state.client;
  let public_key = match PublicKey::from_str(public_key) {
    Ok(val) => val,
    Err(err) => return Err(err.to_string()),
  };
  let duration = timeout.map(Duration::from_secs);
  let filter = Filter::new().kind(Kind::ContactList).author(public_key);
  let events = match client.get_events_of(vec![filter], duration).await {
    Ok(events) => events,
    Err(err) => return Err(err.to_string()),
  };
  let mut ret: Vec<String> = vec![];
  if let Some(latest_event) = events.iter().max_by_key(|event| event.created_at()) {
    ret.extend(latest_event.tags().iter().filter_map(|tag| {
      if let Some(TagStandard::PublicKey {
        uppercase: false, ..
      }) = <nostr_sdk::Tag as Clone>::clone(tag).to_standardized()
      {
        tag.content().map(String::from)
      } else {
        None
      }
    }));
  }
  Ok(ret)
}

pub async fn get_followers(
  state: State<'_, Nostr>,
  public_key: &str,
  timeout: Option<u64>,
) -> Result<Vec<String>, String> {
  let client = &state.client;
  let public_key = match PublicKey::from_str(public_key) {
    Ok(val) => val,
    Err(err) => return Err(err.to_string()),
  };
  let duration = timeout.map(Duration::from_secs);

  let filter = Filter::new().kind(Kind::ContactList).custom_tag(
    SingleLetterTag::lowercase(Alphabet::P),
    vec![public_key.to_hex()],
  );
  let events = match client.get_events_of(vec![filter], duration).await {
    Ok(events) => events,
    Err(err) => return Err(err.to_string()),
  };
  let ret: Vec<String> = events
    .into_iter()
    .map(|event| event.author().to_hex())
    .collect();
  Ok(ret)
  // TODO: get more than 500 events
}

#[tauri::command]
#[specta::specta]
pub async fn get_notifications(state: State<'_, Nostr>) -> Result<Vec<String>, String> {
  let client = &state.client;

  match client.signer().await {
    Ok(signer) => {
      let public_key = signer.public_key().await.unwrap();
      let filter = Filter::new()
        .pubkey(public_key)
        .kinds(vec![
          Kind::TextNote,
          Kind::Repost,
          Kind::Reaction,
          Kind::ZapReceipt,
        ])
        .limit(200);

      match client
        .database()
        .query(vec![filter], Order::default())
        .await
      {
        Ok(events) => Ok(events.into_iter().map(|ev| ev.as_json()).collect()),
        Err(err) => Err(err.to_string()),
      }
    }
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn get_settings(state: State<'_, Nostr>) -> Result<Settings, ()> {
  let settings = state.settings.lock().unwrap().clone();
  Ok(settings)
}

#[tauri::command]
#[specta::specta]
pub async fn set_new_settings(settings: &str, state: State<'_, Nostr>) -> Result<(), ()> {
  let parsed: Settings = serde_json::from_str(settings).expect("Could not parse settings payload");
  *state.settings.lock().unwrap() = parsed;

  Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn verify_nip05(key: &str, nip05: &str) -> Result<bool, String> {
  match PublicKey::from_str(key) {
    Ok(public_key) => {
      let status = nip05::verify(&public_key, nip05, None).await;
      Ok(status.is_ok())
    }
    Err(err) => Err(err.to_string()),
  }
}
