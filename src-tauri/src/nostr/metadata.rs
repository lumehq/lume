use crate::Nostr;
use keyring::Entry;
use nostr_sdk::prelude::*;
use std::{str::FromStr, time::Duration};
use tauri::{Manager, State};
use url::Url;

#[derive(serde::Serialize)]
pub struct CacheContact {
  pubkey: String,
  profile: Metadata,
}

#[tauri::command]
pub fn run_notification(accounts: Vec<String>, app: tauri::AppHandle) -> Result<(), ()> {
  tauri::async_runtime::spawn(async move {
    let window = app.get_window("main").unwrap();
    let state = window.state::<Nostr>();
    let client = &state.client;
    let pubkeys: Vec<PublicKey> = accounts
      .into_iter()
      .map(|f| PublicKey::from_bech32(f).unwrap())
      .collect();
    let subscription = Filter::new()
      .pubkeys(pubkeys)
      .kinds(vec![Kind::TextNote, Kind::Repost, Kind::ZapReceipt])
      .since(Timestamp::now());
    let activity_id = SubscriptionId::new("activity");

    // Create a subscription for activity
    client
      .subscribe_with_id(activity_id.clone(), vec![subscription], None)
      .await;

    // Handle notifications
    let _ = client
      .handle_notifications(|notification| async {
        if let RelayPoolNotification::Event {
          subscription_id,
          event,
          ..
        } = notification
        {
          if subscription_id == activity_id {
            println!("new notification: {}", event.as_json());
            let _ = app.emit("activity", event.as_json());
          }
        }
        Ok(false)
      })
      .await;
  });

  Ok(())
}

#[tauri::command]
pub async fn get_activities(
  account: &str,
  kind: &str,
  state: State<'_, Nostr>,
) -> Result<Vec<Event>, String> {
  let client = &state.client;

  if let Ok(pubkey) = PublicKey::from_str(account) {
    if let Ok(kind) = Kind::from_str(kind) {
      let filter = Filter::new()
        .pubkey(pubkey)
        .kind(kind)
        .limit(100)
        .until(Timestamp::now());

      match client.get_events_of(vec![filter], None).await {
        Ok(events) => Ok(events),
        Err(err) => Err(err.to_string()),
      }
    } else {
      Err("Kind is not valid, please check again.".into())
    }
  } else {
    Err("Public Key is not valid, please check again.".into())
  }
}

#[tauri::command]
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
            if let Tag::PublicKey {
              public_key,
              relay_url,
              alias,
              uppercase: false,
            } = tag
            {
              contact_list.push(Contact::new(public_key, relay_url, alias))
            }
          }
        }
      }

      println!("contact list: {}", contact_list.len());

      match client.set_contact_list(contact_list).await {
        Ok(_) => Ok(true),
        Err(err) => Err(err.to_string()),
      }
    }
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command]
pub async fn get_current_user_profile(state: State<'_, Nostr>) -> Result<Metadata, String> {
  let client = &state.client;
  let signer = client.signer().await.unwrap();
  let public_key = signer.public_key().await.unwrap();
  let filter = Filter::new()
    .author(public_key)
    .kind(Kind::Metadata)
    .limit(1);

  match client
    .get_events_of(vec![filter], Some(Duration::from_secs(10)))
    .await
  {
    Ok(events) => {
      if let Some(event) = events.first() {
        if let Ok(metadata) = Metadata::from_json(&event.content) {
          Ok(metadata)
        } else {
          Err("Parse metadata failed".into())
        }
      } else {
        Err("Not found".into())
      }
    }
    Err(_) => Err("Not found".into()),
  }
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
) -> Result<EventId, String> {
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
    Ok(event_id)
  } else {
    Err("Create profile failed".into())
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
pub async fn set_nstore(
  key: &str,
  content: &str,
  state: State<'_, Nostr>,
) -> Result<EventId, String> {
  let client = &state.client;

  match client.signer().await {
    Ok(signer) => {
      let public_key = signer.public_key().await.unwrap();
      let encrypted = signer.nip44_encrypt(public_key, content).await.unwrap();

      let tag = Tag::Identifier(key.into());
      let builder = EventBuilder::new(Kind::ApplicationSpecificData, encrypted, vec![tag]);

      match client.send_event_builder(builder).await {
        Ok(event_id) => {
          println!("set nstore: {}", event_id);
          Ok(event_id)
        }
        Err(err) => Err(err.to_string()),
      }
    }
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command]
pub async fn get_nstore(key: &str, state: State<'_, Nostr>) -> Result<String, String> {
  let client = &state.client;

  if let Ok(signer) = client.signer().await {
    let public_key = signer.public_key().await;

    if let Ok(author) = public_key {
      let filter = Filter::new()
        .author(author)
        .kind(Kind::ApplicationSpecificData)
        .identifier(key)
        .limit(1);

      let query = client
        .get_events_of(vec![filter], Some(Duration::from_secs(10)))
        .await;

      if let Ok(events) = query {
        if let Some(event) = events.first() {
          println!("get nstore key: {} - received: {}", key, event.id);

          let content = event.content();

          match signer.nip44_decrypt(author, content).await {
            Ok(decrypted) => Ok(decrypted),
            Err(_) => Err(event.content.to_string()),
          }
        } else {
          println!("get nstore key: {}", key);
          Err("Value not found".into())
        }
      } else {
        Err("Query nstore event failed".into())
      }
    } else {
      Err("Something is wrong".into())
    }
  } else {
    Err("Signer is required".into())
  }
}

#[tauri::command]
pub async fn set_nwc(uri: &str, state: State<'_, Nostr>) -> Result<bool, String> {
  let client = &state.client;

  if let Ok(nwc_uri) = NostrWalletConnectURI::from_str(&uri) {
    if let Ok(nwc) = NWC::new(nwc_uri).await {
      let keyring = Entry::new("Lume Secret Storage", "NWC").unwrap();
      let _ = keyring.set_password(uri);
      let _ = client.set_zapper(nwc).await;

      Ok(true)
    } else {
      Err("URI is not valid".into())
    }
  } else {
    Err("Set NWC failed".into())
  }
}

#[tauri::command]
pub async fn load_nwc(state: State<'_, Nostr>) -> Result<bool, String> {
  let client = &state.client;
  let keyring = Entry::new("Lume Secret Storage", "NWC").unwrap();

  match keyring.get_password() {
    Ok(val) => {
      let uri = NostrWalletConnectURI::from_str(&val).unwrap();
      if let Ok(nwc) = NWC::new(uri).await {
        client.set_zapper(nwc).await;
        Ok(true)
      } else {
        Err("Cannot connect to NWC".into())
      }
    }
    Err(_) => Ok(false),
  }
}

#[tauri::command]
pub async fn get_balance() -> Result<u64, String> {
  let keyring = Entry::new("Lume Secret Storage", "NWC").unwrap();

  match keyring.get_password() {
    Ok(val) => {
      let uri = NostrWalletConnectURI::from_str(&val).unwrap();
      if let Ok(nwc) = NWC::new(uri).await {
        if let Ok(balance) = nwc.get_balance().await {
          Ok(balance)
        } else {
          Err("Get balance failed".into())
        }
      } else {
        Err("Cannot connect to NWC".into())
      }
    }
    Err(_) => Err("Something wrong".into()),
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
