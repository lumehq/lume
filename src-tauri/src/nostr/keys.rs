use crate::AppState;
use nostr::nips::nip19::ToBech32;
use nostr::secp256k1::SecretKey;
use nostr::{FromBech32, Keys, Result};
use nostr_sdk::ClientSigner;
use tauri::State;

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
pub fn get_public_key(secret_key: SecretKey) -> Result<String, ()> {
  let keys = Keys::new(secret_key);
  Ok(keys.public_key().to_bech32().expect("secret key failed"))
}

#[tauri::command]
pub async fn update_signer(key: String, app_state: State<'_, AppState>) -> Result<(), ()> {
  let client = &app_state.nostr;
  let secret_key = SecretKey::from_bech32(key).unwrap();
  let keys = Keys::new(secret_key);
  let signer = ClientSigner::Keys(keys);

  client.set_signer(Some(signer)).await;

  Ok(())
}
