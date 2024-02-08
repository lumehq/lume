use crate::Nostr;
use keyring::Entry;
use nostr_sdk::prelude::*;
use std::{fs::File, io::Write, str::FromStr};
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

  Ok(result.into())
}

#[tauri::command]
pub fn save_key(nsec: &str, app_handle: tauri::AppHandle) -> Result<(), ()> {
  if let Ok(nostr_secret_key) = SecretKey::from_bech32(nsec) {
    let nostr_keys = Keys::new(nostr_secret_key);
    let nostr_npub = nostr_keys.public_key().to_bech32().unwrap();

    let keyring_entry = Entry::new("Lume Secret Storage", "AppKey").unwrap();
    let secret_key = keyring_entry.get_password().unwrap();
    let app_key = age::x25519::Identity::from_str(&secret_key).unwrap();
    let app_pubkey = app_key.to_public();

    let config_dir = app_handle.path().app_config_dir().unwrap();
    let encryptor =
      age::Encryptor::with_recipients(vec![Box::new(app_pubkey)]).expect("we provided a recipient");

    let file_ext = ".nsec".to_owned();
    let file_path = nostr_npub + &file_ext;
    let mut file = File::create(config_dir.join(file_path)).unwrap();
    let mut writer = encryptor
      .wrap_output(&mut file)
      .expect("Init writer failed");
    writer
      .write_all(nsec.as_bytes())
      .expect("Write nsec failed");
    writer.finish().expect("Save nsec failed");

    Ok(())
  } else {
    Err(())
  }
}

#[tauri::command]
pub fn get_public_key(nsec: &str) -> Result<String, ()> {
  let secret_key = SecretKey::from_bech32(nsec).unwrap();
  let keys = Keys::new(secret_key);
  Ok(keys.public_key().to_bech32().expect("secret key failed"))
}

#[tauri::command]
pub async fn update_signer(nsec: &str, nostr: State<'_, Nostr>) -> Result<(), ()> {
  let client = &nostr.client;
  let secret_key = SecretKey::from_bech32(nsec).unwrap();
  let keys = Keys::new(secret_key);
  let signer = ClientSigner::Keys(keys);

  client.set_signer(Some(signer)).await;

  Ok(())
}

#[tauri::command]
pub async fn verify_signer(nostr: State<'_, Nostr>) -> Result<bool, ()> {
  let client = &nostr.client;
  let status = client.signer().await.is_ok();

  Ok(status)
}

#[tauri::command]
pub fn event_to_bech32(id: &str, relays: Vec<String>) -> Result<String, ()> {
  let event_id = EventId::from_hex(id).unwrap();
  let event = Nip19Event::new(event_id, relays);

  Ok(event.to_bech32().unwrap())
}

#[tauri::command]
pub fn user_to_bech32(key: &str, relays: Vec<String>) -> Result<String, ()> {
  let pubkey = XOnlyPublicKey::from_str(key).unwrap();
  let profile = Nip19Profile::new(pubkey, relays);

  Ok(profile.to_bech32().unwrap())
}
