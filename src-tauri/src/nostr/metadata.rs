use crate::Nostr;
use keyring::Entry;
use nostr_sdk::prelude::*;
use std::{str::FromStr, time::Duration};
use tauri::State;

#[derive(serde::Serialize)]
pub struct CacheContact {
  pubkey: String,
  profile: Metadata,
}

#[tauri::command]
pub async fn get_profile(id: &str, state: State<'_, Nostr>) -> Result<Metadata, String> {
  let client = &state.client;
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
    let query = client
      .get_events_of(vec![filter], Some(Duration::from_secs(10)))
      .await;

    if let Ok(events) = query {
      if let Some(event) = events.first() {
        if let Ok(metadata) = Metadata::from_json(&event.content) {
          Ok(metadata)
        } else {
          Err("Parse metadata failed".into())
        }
      } else {
        let rand_metadata = Metadata::new();
        Ok(rand_metadata)
      }
    } else {
      Err("Get metadata failed".into())
    }
  } else {
    Err("Public Key is not valid".into())
  }
}

#[tauri::command]
pub async fn get_contact_list(state: State<'_, Nostr>) -> Result<Vec<String>, String> {
  let client = &state.client;

  if let Ok(contact_list) = client.get_contact_list(Some(Duration::from_secs(10))).await {
    let list = contact_list
      .into_iter()
      .map(|f| f.public_key.to_hex())
      .collect();

    Ok(list)
  } else {
    Err("Contact list not found".into())
  }
}

#[tauri::command]
pub async fn get_contact_metadata(state: State<'_, Nostr>) -> Result<Vec<CacheContact>, String> {
  let client = &state.client;

  if let Ok(contact_list) = client
    .get_contact_list_metadata(Some(Duration::from_secs(10)))
    .await
  {
    let list: Vec<CacheContact> = contact_list
      .into_iter()
      .map(|(id, metadata)| CacheContact {
        pubkey: id.to_hex(),
        profile: metadata,
      })
      .collect();

    Ok(list)
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
  state: State<'_, Nostr>,
) -> Result<EventId, ()> {
  let client = &state.client;
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

#[tauri::command]
pub async fn follow(
  id: &str,
  alias: Option<&str>,
  state: State<'_, Nostr>,
) -> Result<EventId, String> {
  let client = &state.client;
  let public_key = PublicKey::from_str(id).unwrap();
  let contact = Contact::new(public_key, None, alias);
  let contact_list = client.get_contact_list(Some(Duration::from_secs(10))).await;

  if let Ok(mut old_list) = contact_list {
    old_list.push(contact);
    let new_list = old_list.into_iter();

    if let Ok(event_id) = client.set_contact_list(new_list).await {
      Ok(event_id)
    } else {
      Err("Follow failed".into())
    }
  } else {
    Err("Follow failed".into())
  }
}

#[tauri::command]
pub async fn unfollow(id: &str, state: State<'_, Nostr>) -> Result<EventId, String> {
  let client = &state.client;
  let public_key = PublicKey::from_str(id).unwrap();
  let contact_list = client.get_contact_list(Some(Duration::from_secs(10))).await;

  if let Ok(mut old_list) = contact_list {
    let index = old_list
      .iter()
      .position(|x| x.public_key == public_key)
      .unwrap();
    old_list.remove(index);

    let new_list = old_list.into_iter();

    if let Ok(event_id) = client.set_contact_list(new_list).await {
      Ok(event_id)
    } else {
      Err("Follow failed".into())
    }
  } else {
    Err("Follow failed".into())
  }
}

#[tauri::command]
pub async fn set_interest(content: &str, state: State<'_, Nostr>) -> Result<EventId, String> {
  let client = &state.client;
  let tag = Tag::Identifier("lume_user_interest".into());
  let builder = EventBuilder::new(Kind::ApplicationSpecificData, content, vec![tag]);

  if let Ok(event_id) = client.send_event_builder(builder).await {
    Ok(event_id)
  } else {
    Err("Set interest failed".into())
  }
}

#[tauri::command]
pub async fn get_interest(id: &str, state: State<'_, Nostr>) -> Result<String, String> {
  let client = &state.client;
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
    let filter = Filter::new()
      .author(author)
      .kind(Kind::ApplicationSpecificData)
      .identifier("lume_user_interest")
      .limit(1);

    let query = client
      .get_events_of(vec![filter], Some(Duration::from_secs(10)))
      .await;

    if let Ok(events) = query {
      if let Some(event) = events.first() {
        Ok(event.content.to_string())
      } else {
        Err("User interest not found".into())
      }
    } else {
      Err("User interest not found".into())
    }
  } else {
    Err("Get interest failed".into())
  }
}

#[tauri::command]
pub async fn set_settings(content: &str, state: State<'_, Nostr>) -> Result<EventId, String> {
  let client = &state.client;
  let tag = Tag::Identifier("lume_user_settings".into());
  let builder = EventBuilder::new(Kind::ApplicationSpecificData, content, vec![tag]);

  if let Ok(event_id) = client.send_event_builder(builder).await {
    Ok(event_id)
  } else {
    Err("Set interest failed".into())
  }
}

#[tauri::command]
pub async fn get_settings(id: &str, state: State<'_, Nostr>) -> Result<String, String> {
  let client = &state.client;
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
    let filter = Filter::new()
      .author(author)
      .kind(Kind::ApplicationSpecificData)
      .identifier("lume_user_settings")
      .limit(1);

    let query = client
      .get_events_of(vec![filter], Some(Duration::from_secs(10)))
      .await;

    if let Ok(events) = query {
      if let Some(event) = events.first() {
        Ok(event.content.to_string())
      } else {
        Err("User settings not found".into())
      }
    } else {
      Err("User settings not found".into())
    }
  } else {
    Err("Get settings failed".into())
  }
}

#[tauri::command]
pub async fn get_nwc_status(state: State<'_, Nostr>) -> Result<bool, ()> {
  let client = &state.client;
  let zapper = client.zapper().await.is_ok();

  Ok(zapper)
}

#[tauri::command]
pub async fn set_nwc(uri: &str, state: State<'_, Nostr>) -> Result<bool, String> {
  let client = &state.client;

  if let Ok(nwc_uri) = NostrWalletConnectURI::from_str(&uri) {
    if let Ok(nwc) = NWC::new(nwc_uri).await {
      let keyring = Entry::new("Lume Secret Storage", "NWC").unwrap();
      let _ = keyring.set_password(uri);
      let _ = client.set_zapper(nwc);

      Ok(true)
    } else {
      Err("URI is not valid".into())
    }
  } else {
    Err("Set NWC failed".into())
  }
}

#[tauri::command]
pub async fn nwc_status(state: State<'_, Nostr>) -> Result<bool, bool> {
  let client = &state.client;
  match client.zapper().await {
    Ok(_) => Ok(true),
    Err(_) => Err(false),
  }
}

#[tauri::command]
pub async fn zap_profile(
  id: &str,
  amount: u64,
  message: &str,
  state: State<'_, Nostr>,
) -> Result<bool, String> {
  let client = &state.client;
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

  if let Some(recipient) = public_key {
    let details = ZapDetails::new(ZapType::Public).message(message);

    if let Ok(_) = client.zap(recipient, amount, Some(details)).await {
      Ok(true)
    } else {
      Err("Zap profile failed".into())
    }
  } else {
    Err("Parse public key failed".into())
  }
}

#[tauri::command]
pub async fn zap_event(
  id: &str,
  amount: u64,
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

    if let Ok(_) = client.zap(recipient, amount, Some(details)).await {
      Ok(true)
    } else {
      Err("Zap event failed".into())
    }
  } else {
    Err("Parse public key failed".into())
  }
}
