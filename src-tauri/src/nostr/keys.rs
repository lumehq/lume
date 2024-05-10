use crate::Nostr;
use keyring::Entry;
use nostr_sdk::prelude::*;
use std::time::Duration;
use std::{fs::File, str::FromStr};
use tauri::{Manager, State};

#[derive(serde::Serialize)]
pub struct CreateKeysResponse {
  npub: String,
  nsec: String,
}

#[tauri::command]
pub fn create_keys() -> Result<CreateKeysResponse, ()> {
  let keys = Keys::generate();
  let public_key = keys.public_key();
  let secret_key = keys.secret_key().expect("secret key failed");

  let result = CreateKeysResponse {
    npub: public_key.to_bech32().expect("npub failed"),
    nsec: secret_key.to_bech32().expect("nsec failed"),
  };

  Ok(result)
}

#[tauri::command]
pub async fn save_key(
  nsec: &str,
  password: &str,
  app_handle: tauri::AppHandle,
  state: State<'_, Nostr>,
) -> Result<String, String> {
  let secret_key: Result<SecretKey, String>;

  if nsec.starts_with("ncryptsec") {
    let encrypted_key = EncryptedSecretKey::from_bech32(nsec).unwrap();
    secret_key = match encrypted_key.to_secret_key(password) {
      Ok(val) => Ok(val),
      Err(_) => Err("Wrong passphase".into()),
    };
  } else {
    secret_key = match SecretKey::from_bech32(nsec) {
      Ok(val) => Ok(val),
      Err(_) => Err("nsec is not valid".into()),
    }
  }

  match secret_key {
    Ok(val) => {
      let nostr_keys = Keys::new(val);
      let npub = nostr_keys.public_key().to_bech32().unwrap();
      let nsec = nostr_keys.secret_key().unwrap().to_bech32().unwrap();

      let home_dir = app_handle.path().home_dir().unwrap();
      let app_dir = home_dir.join("Lume/");

      let file_path = npub.clone() + ".npub";
      let _ = File::create(app_dir.join(file_path)).unwrap();

      let keyring = Entry::new("Lume Secret Storage", &npub).unwrap();
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
pub async fn nostr_connect(
  npub: &str,
  uri: &str,
  app_handle: tauri::AppHandle,
  state: State<'_, Nostr>,
) -> Result<String, String> {
  let client = &state.client;
  let app_keys = Keys::generate();

  match NostrConnectURI::parse(uri) {
    Ok(bunker_uri) => {
      println!("connecting... {}", uri);

      match Nip46Signer::new(bunker_uri, app_keys, Duration::from_secs(120), None).await {
        Ok(signer) => {
          let home_dir = app_handle.path().home_dir().unwrap();
          let app_dir = home_dir.join("Lume/");
          let file_path = npub.to_owned() + ".npub";
          let keyring = Entry::new("Lume Secret Storage", npub).unwrap();
          let _ = File::create(app_dir.join(file_path)).unwrap();
          let _ = keyring.set_password(uri);
          let _ = client.set_signer(Some(signer.into())).await;

          Ok(npub.into())
        }
        Err(err) => Err(err.to_string()),
      }
    }
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command]
pub async fn verify_signer(state: State<'_, Nostr>) -> Result<bool, ()> {
  let client = &state.client;

  if (client.signer().await).is_ok() {
    Ok(true)
  } else {
    Ok(false)
  }
}

#[tauri::command]
pub fn get_encrypted_key(npub: &str, password: &str) -> Result<String, String> {
  let keyring = Entry::new("Lume Secret Storage", npub).unwrap();

  if let Ok(nsec) = keyring.get_password() {
    let secret_key = SecretKey::from_bech32(nsec).expect("Get secret key failed");
    let new_key = EncryptedSecretKey::new(&secret_key, password, 16, KeySecurity::Unknown);

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
pub fn get_stored_nsec(npub: &str) -> Result<String, String> {
  let keyring = Entry::new("Lume Secret Storage", npub).unwrap();

  if let Ok(nsec) = keyring.get_password() {
    Ok(nsec)
  } else {
    Err("Key not found".into())
  }
}

#[tauri::command]
pub async fn load_selected_account(npub: &str, state: State<'_, Nostr>) -> Result<bool, String> {
  let client = &state.client;
  let keyring = Entry::new("Lume Secret Storage", npub).unwrap();

  match keyring.get_password() {
    Ok(password) => {
      if password.starts_with("bunker://") {
        let app_keys = Keys::generate();
        let bunker_uri = NostrConnectURI::parse(password).unwrap();
        let signer = Nip46Signer::new(bunker_uri, app_keys, Duration::from_secs(60), None)
          .await
          .unwrap();

        // Update signer
        client.set_signer(Some(signer.into())).await;
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
              println!("connecting to relay: {}", item.0);
              // Add relay to pool
              let _ = client
                .add_relay(item.0.to_string())
                .await
                .unwrap_or_default();
              // Connect relay
              client
                .connect_relay(item.0.to_string())
                .await
                .unwrap_or_default();
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
pub fn event_to_bech32(id: &str, relays: Vec<String>) -> Result<String, ()> {
  let event_id = EventId::from_hex(id).unwrap();
  let event = Nip19Event::new(event_id, relays);

  Ok(event.to_bech32().unwrap())
}

#[tauri::command]
pub fn user_to_bech32(key: &str, relays: Vec<String>) -> Result<String, ()> {
  let pubkey = PublicKey::from_str(key).unwrap();
  let profile = Nip19Profile::new(pubkey, relays).unwrap();

  Ok(profile.to_bech32().unwrap())
}

#[tauri::command]
pub fn to_npub(hex: &str) -> Result<String, ()> {
  let public_key = PublicKey::from_str(hex).unwrap();
  let npub = Nip19::Pubkey(public_key);

  Ok(npub.to_bech32().unwrap())
}

#[tauri::command(async)]
pub async fn verify_nip05(key: &str, nip05: &str) -> Result<bool, ()> {
  let public_key = PublicKey::from_str(key).unwrap();
  let status = nip05::verify(public_key, nip05, None).await;

  if status.is_ok() {
    Ok(true)
  } else {
    Ok(false)
  }
}
