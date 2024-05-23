use crate::Nostr;
use keyring::Entry;
use keyring_search::{Limit, List, Search};
use nostr_sdk::prelude::*;
use serde::Serialize;
use specta::Type;
use std::str::FromStr;
use std::time::Duration;
use tauri::State;

#[derive(Serialize, Type)]
pub struct Account {
  npub: String,
  nsec: String,
}

#[tauri::command]
#[specta::specta]
pub fn get_accounts() -> Result<String, String> {
  let search = Search::new().unwrap();
  let results = search.by("Account", "nostr_secret");

  match List::list_credentials(results, Limit::All) {
    Ok(list) => Ok(list),
    Err(_) => Err("Empty.".into()),
  }
}

#[tauri::command]
#[specta::specta]
pub fn create_account() -> Result<Account, ()> {
  let keys = Keys::generate();
  let public_key = keys.public_key();
  let secret_key = keys.secret_key().unwrap();

  let result = Account {
    npub: public_key.to_bech32().unwrap(),
    nsec: secret_key.to_bech32().unwrap(),
  };

  Ok(result)
}

#[tauri::command]
#[specta::specta]
pub async fn save_account(
  nsec: &str,
  password: &str,
  state: State<'_, Nostr>,
) -> Result<String, String> {
  let secret_key: Result<SecretKey, String>;

  if nsec.starts_with("ncryptsec") {
    let encrypted_key = EncryptedSecretKey::from_bech32(nsec).unwrap();
    secret_key = match encrypted_key.to_secret_key(password) {
      Ok(val) => Ok(val),
      Err(err) => Err(err.to_string()),
    };
  } else {
    secret_key = match SecretKey::from_bech32(nsec) {
      Ok(val) => Ok(val),
      Err(err) => Err(err.to_string()),
    }
  }

  match secret_key {
    Ok(val) => {
      let nostr_keys = Keys::new(val);
      let npub = nostr_keys.public_key().to_bech32().unwrap();
      let nsec = nostr_keys.secret_key().unwrap().to_bech32().unwrap();

      let keyring = Entry::new(&npub, "nostr_secret").unwrap();
      let _ = keyring.set_password(&nsec);

      let signer = NostrSigner::Keys(nostr_keys);
      let client = &state.client;

      // Update client's signer
      client.set_signer(Some(signer)).await;

      Ok(npub)
    }
    Err(msg) => Err(msg),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn load_account(npub: &str, state: State<'_, Nostr>) -> Result<bool, String> {
  let client = &state.client;
  let keyring = Entry::new(&npub, "nostr_secret").unwrap();

  match keyring.get_password() {
    Ok(password) => {
      if password.starts_with("bunker://") {
        let local_keyring = Entry::new(&npub, "bunker_local_account").unwrap();

        match local_keyring.get_password() {
          Ok(local_password) => {
            let secret_key = SecretKey::from_bech32(local_password).unwrap();
            let app_keys = Keys::new(secret_key);
            let bunker_uri = NostrConnectURI::parse(password).unwrap();
            let signer = Nip46Signer::new(bunker_uri, app_keys, Duration::from_secs(60), None)
              .await
              .unwrap();

            // Update signer
            client.set_signer(Some(signer.into())).await;
          }
          Err(_) => todo!(),
        }
      } else {
        let secret_key = SecretKey::from_bech32(password).expect("Get secret key failed");
        let keys = Keys::new(secret_key);
        let signer = NostrSigner::Keys(keys);

        // Update signer
        client.set_signer(Some(signer)).await;
      }

      // Verify signer
      let signer = client.signer().await.unwrap();
      let public_key = signer.public_key().await.unwrap();

      // Connect to user's relay
      let filter = Filter::new()
        .author(public_key)
        .kind(Kind::RelayList)
        .limit(1);

      match client
        .get_events_of(vec![filter], Some(Duration::from_secs(10)))
        .await
      {
        Ok(events) => {
          if let Some(event) = events.first() {
            let relay_list = nip65::extract_relay_list(event);
            for item in relay_list.into_iter() {
              println!("connecting to relay: {} - {:?}", item.0, item.1);

              let relay_url = item.0.to_string();
              let opts = match item.1 {
                Some(val) => {
                  if val == &RelayMetadata::Read {
                    RelayOptions::new().read(true).write(false)
                  } else {
                    RelayOptions::new().write(true).read(false)
                  }
                }
                None => RelayOptions::new(),
              };

              // Add relay to relay pool
              let _ = client
                .add_relay_with_opts(relay_url.clone(), opts)
                .await
                .unwrap_or_default();

              // Connect relay
              client.connect_relay(relay_url).await.unwrap_or_default();
            }
          }
        }
        Err(_) => todo!(),
      };

      Ok(true)
    }
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn nostr_connect(
  npub: &str,
  uri: &str,
  state: State<'_, Nostr>,
) -> Result<String, String> {
  let client = &state.client;
  let local_key = Keys::generate();

  match NostrConnectURI::parse(uri) {
    Ok(bunker_uri) => {
      match Nip46Signer::new(
        bunker_uri,
        local_key.clone(),
        Duration::from_secs(120),
        None,
      )
      .await
      {
        Ok(signer) => {
          let local_secret = local_key.secret_key().unwrap().to_bech32().unwrap();
          let secret_keyring = Entry::new(&npub, "nostr_secret").unwrap();
          let account_keyring = Entry::new(&npub, "bunker_local_account").unwrap();
          let _ = secret_keyring.set_password(uri);
          let _ = account_keyring.set_password(&local_secret);

          // Update signer
          let _ = client.set_signer(Some(signer.into())).await;

          Ok(npub.into())
        }
        Err(err) => Err(err.to_string()),
      }
    }
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command(async)]
#[specta::specta]
pub fn get_encrypted_key(npub: &str, password: &str) -> Result<String, String> {
  let keyring = Entry::new(npub, "nostr_secret").unwrap();

  if let Ok(nsec) = keyring.get_password() {
    let secret_key = SecretKey::from_bech32(nsec).unwrap();
    let new_key = EncryptedSecretKey::new(&secret_key, password, 16, KeySecurity::Medium);

    if let Ok(key) = new_key {
      Ok(key.to_bech32().unwrap())
    } else {
      Err("Encrypt key failed".into())
    }
  } else {
    Err("Key not found".into())
  }
}

#[tauri::command]
#[specta::specta]
pub fn event_to_bech32(id: &str, relays: Vec<String>) -> Result<String, ()> {
  let event_id = EventId::from_hex(id).unwrap();
  let event = Nip19Event::new(event_id, relays);

  Ok(event.to_bech32().unwrap())
}

#[tauri::command]
#[specta::specta]
pub fn user_to_bech32(key: &str, relays: Vec<String>) -> Result<String, ()> {
  let pubkey = PublicKey::from_str(key).unwrap();
  let profile = Nip19Profile::new(pubkey, relays).unwrap();

  Ok(profile.to_bech32().unwrap())
}

#[tauri::command]
#[specta::specta]
pub fn to_npub(hex: &str) -> Result<String, ()> {
  let public_key = PublicKey::from_str(hex).unwrap();
  let npub = Nip19::Pubkey(public_key);

  Ok(npub.to_bech32().unwrap())
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
