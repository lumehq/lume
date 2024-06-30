use std::time::Duration;

use keyring::Entry;
use keyring_search::{Limit, List, Search};
use nostr_sdk::prelude::*;
use serde::Serialize;
use specta::Type;
use tauri::{EventTarget, Manager, State};
use tauri_plugin_notification::NotificationExt;

use crate::nostr::event::RichEvent;
use crate::nostr::utils::parse_event;
use crate::{Nostr, Settings, NEWSFEED_NEG_LIMIT, NOTIFICATION_NEG_LIMIT};

#[derive(Serialize, Type)]
pub struct Account {
  npub: String,
  nsec: String,
}

#[tauri::command]
#[specta::specta]
pub fn get_accounts() -> Result<Vec<String>, String> {
  let search = Search::new().unwrap();
  let results = search.by("Account", "nostr_secret");

  match List::list_credentials(results, Limit::All) {
    Ok(list) => {
      let search: Vec<String> = list
        .split_whitespace()
        .map(|v| v.to_string())
        .filter(|v| v.starts_with("npub1"))
        .collect();

      let accounts: Vec<String> = search
        .into_iter()
        .collect::<std::collections::HashSet<_>>()
        .into_iter()
        .collect();

      Ok(accounts)
    }
    Err(_) => Err("Empty.".into()),
  }
}

#[tauri::command]
#[specta::specta]
pub fn create_account() -> Result<Account, String> {
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
pub fn get_private_key(npub: &str) -> Result<String, String> {
  let keyring = Entry::new(npub, "nostr_secret").unwrap();

  if let Ok(nsec) = keyring.get_password() {
    let secret_key = SecretKey::from_bech32(nsec).unwrap();
    Ok(secret_key.to_bech32().unwrap())
  } else {
    Err("Key not found".into())
  }
}

#[tauri::command]
#[specta::specta]
pub async fn save_account(
  nsec: &str,
  password: &str,
  state: State<'_, Nostr>,
) -> Result<String, String> {
  let secret_key = if nsec.starts_with("ncryptsec") {
    let encrypted_key = EncryptedSecretKey::from_bech32(nsec).unwrap();
    encrypted_key
      .to_secret_key(password)
      .map_err(|err| err.to_string())
  } else {
    SecretKey::from_bech32(nsec).map_err(|err| err.to_string())
  };

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
pub async fn connect_remote_account(uri: &str, state: State<'_, Nostr>) -> Result<String, String> {
  let client = &state.client;

  match NostrConnectURI::parse(uri) {
    Ok(bunker_uri) => {
      let app_keys = Keys::generate();
      let app_secret = app_keys.secret_key().unwrap().to_string();

      // Get remote user
      let remote_user = bunker_uri.signer_public_key().unwrap();
      let remote_npub = remote_user.to_bech32().unwrap();

      match Nip46Signer::new(bunker_uri, app_keys, Duration::from_secs(120), None).await {
        Ok(signer) => {
          let keyring = Entry::new(&remote_npub, "nostr_secret").unwrap();
          let _ = keyring.set_password(&app_secret);

          // Update signer
          let _ = client.set_signer(Some(signer.into())).await;

          Ok(remote_npub)
        }
        Err(err) => Err(err.to_string()),
      }
    }
    Err(err) => Err(err.to_string()),
  }
}

#[tauri::command]
#[specta::specta]
pub async fn get_encrypted_key(npub: &str, password: &str) -> Result<String, String> {
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
pub async fn load_account(
  npub: &str,
  bunker: Option<&str>,
  state: State<'_, Nostr>,
  app: tauri::AppHandle,
) -> Result<bool, String> {
  let client = &state.client;
  let keyring = Entry::new(npub, "nostr_secret").unwrap();

  let password = match keyring.get_password() {
    Ok(pw) => pw,
    Err(_) => return Err("Cancelled".into()),
  };

  match bunker {
    Some(uri) => {
      let app_keys = Keys::parse(password).expect("Secret Key is modified, please check again.");

      match NostrConnectURI::parse(uri) {
        Ok(bunker_uri) => {
          match Nip46Signer::new(bunker_uri, app_keys, Duration::from_secs(30), None).await {
            Ok(signer) => client.set_signer(Some(signer.into())).await,
            Err(err) => return Err(err.to_string()),
          }
        }
        Err(err) => return Err(err.to_string()),
      }
    }
    None => {
      let keys = Keys::parse(password).expect("Secret Key is modified, please check again.");
      let signer = NostrSigner::Keys(keys);

      // Update signer
      client.set_signer(Some(signer)).await;
    }
  }

  // Verify signer
  let signer = client.signer().await.unwrap();
  let public_key = signer.public_key().await.unwrap();

  // Connect to user's relay (NIP-65)
  if let Ok(events) = client
    .get_events_of(
      vec![Filter::new()
        .author(public_key)
        .kind(Kind::RelayList)
        .limit(1)],
      None,
    )
    .await
  {
    if let Some(event) = events.first() {
      let relay_list = nip65::extract_relay_list(event);
      for item in relay_list.into_iter() {
        let relay_url = item.0.to_string();
        let opts = match item.1 {
          Some(val) => {
            if val == &RelayMetadata::Read {
              RelayOptions::new().read(true).write(false)
            } else {
              RelayOptions::new().write(true).read(false)
            }
          }
          None => RelayOptions::default(),
        };

        // Add relay to relay pool
        let _ = client
          .add_relay_with_opts(&relay_url, opts)
          .await
          .unwrap_or_default();

        // Connect relay
        client.connect_relay(relay_url).await.unwrap_or_default();
        println!("connecting to relay: {} - {:?}", item.0, item.1);
      }
    }
  };

  // Get user's contact list
  if let Ok(contacts) = client.get_contact_list(None).await {
    *state.contact_list.lock().unwrap() = contacts
  };

  // Create a subscription for notification
  let sub_id = SubscriptionId::new("notification");
  let filter = Filter::new()
    .pubkey(public_key)
    .kinds(vec![
      Kind::TextNote,
      Kind::Repost,
      Kind::Reaction,
      Kind::ZapReceipt,
    ])
    .since(Timestamp::now());

  // Subscribe
  print!("Subscribing for new notification...");
  client.subscribe_with_id(sub_id, vec![filter], None).await;

  // Get user's settings
  let handle = app.clone();
  // Spawn a thread to handle it
  tauri::async_runtime::spawn(async move {
    let window = handle.get_window("main").unwrap();
    let state = window.state::<Nostr>();
    let client = &state.client;

    let ident = "lume:settings";
    let filter = Filter::new()
      .author(public_key)
      .kind(Kind::ApplicationSpecificData)
      .identifier(ident)
      .limit(1);

    if let Ok(events) = client
      .get_events_of(vec![filter], Some(Duration::from_secs(5)))
      .await
    {
      if let Some(event) = events.first() {
        let content = event.content();
        if let Ok(decrypted) = signer.nip44_decrypt(public_key, content).await {
          let parsed: Settings =
            serde_json::from_str(&decrypted).expect("Could not parse settings payload");

          *state.settings.lock().unwrap() = parsed;
        }
      }
    }
  });

  // Run sync service
  let handle = app.clone();
  // Spawn a thread to handle it
  tauri::async_runtime::spawn(async move {
    let window = handle.get_window("main").unwrap();
    let state = window.state::<Nostr>();
    let client = &state.client;
    let contact_list = state.contact_list.lock().unwrap().clone();

    let notification = Filter::new()
      .pubkey(public_key)
      .kinds(vec![
        Kind::TextNote,
        Kind::Repost,
        Kind::Reaction,
        Kind::ZapReceipt,
      ])
      .limit(NOTIFICATION_NEG_LIMIT);

    match client
      .reconcile(notification, NegentropyOptions::default())
      .await
    {
      Ok(_) => {
        if handle.emit_to(EventTarget::Any, "synced", true).is_err() {
          println!("Emit event failed.")
        }
      }
      Err(_) => println!("Sync notification failed."),
    };

    if !contact_list.is_empty() {
      let authors: Vec<PublicKey> = contact_list.into_iter().map(|f| f.public_key).collect();

      let newsfeed = Filter::new()
        .authors(authors)
        .kinds(vec![Kind::TextNote, Kind::Repost])
        .limit(NEWSFEED_NEG_LIMIT);

      match client
        .reconcile(newsfeed, NegentropyOptions::default())
        .await
      {
        Ok(_) => {
          if handle.emit_to(EventTarget::Any, "synced", true).is_err() {
            println!("Emit event failed.")
          }
        }
        Err(_) => println!("Sync newsfeed failed."),
      }
    }
  });

  // Run notification service
  // Spawn a thread to handle it
  tauri::async_runtime::spawn(async move {
    let window = app.get_window("main").unwrap();
    let state = window.state::<Nostr>();
    let client = &state.client;

    // Handle notifications
    client
      .handle_notifications(|notification| async {
        if let RelayPoolNotification::Message { message, .. } = notification {
          if let RelayMessage::Event {
            subscription_id,
            event,
          } = message
          {
            let id = subscription_id.to_string();

            if id.starts_with("notification") {
              if app
                .emit_to(
                  EventTarget::window("panel"),
                  "notification",
                  event.as_json(),
                )
                .is_err()
              {
                println!("Emit new notification failed.")
              }

              let handle = app.app_handle();
              let author = client.metadata(event.pubkey).await.unwrap();

              match event.kind() {
                Kind::TextNote => {
                  if let Err(e) = handle
                    .notification()
                    .builder()
                    .body("Mentioned you in a thread.")
                    .title(author.display_name.unwrap_or_else(|| "Lume".to_string()))
                    .show()
                  {
                    println!("Failed to show notification: {:?}", e);
                  }
                }
                Kind::Repost => {
                  if let Err(e) = handle
                    .notification()
                    .builder()
                    .body("Reposted your note.")
                    .title(author.display_name.unwrap_or_else(|| "Lume".to_string()))
                    .show()
                  {
                    println!("Failed to show notification: {:?}", e);
                  }
                }
                Kind::Reaction => {
                  let content = event.content();
                  if let Err(e) = handle
                    .notification()
                    .builder()
                    .body(content)
                    .title(author.display_name.unwrap_or_else(|| "Lume".to_string()))
                    .show()
                  {
                    println!("Failed to show notification: {:?}", e);
                  }
                }
                Kind::ZapReceipt => {
                  if let Err(e) = handle
                    .notification()
                    .builder()
                    .body("Zapped you.")
                    .title(author.display_name.unwrap_or_else(|| "Lume".to_string()))
                    .show()
                  {
                    println!("Failed to show notification: {:?}", e);
                  }
                }
                _ => {}
              }
            } else if id.starts_with("event-") {
              let raw = event.as_json();
              let parsed = if event.kind == Kind::TextNote {
                Some(parse_event(&event.content).await)
              } else {
                None
              };

              if app
                .emit_to(
                  EventTarget::window(id),
                  "new_reply",
                  RichEvent { raw, parsed },
                )
                .is_err()
              {
                println!("Emit new notification failed.")
              }
            } else if id.starts_with("column-") {
              let raw = event.as_json();
              let parsed = if event.kind == Kind::TextNote {
                Some(parse_event(&event.content).await)
              } else {
                None
              };

              if app
                .emit_to(
                  EventTarget::window(id),
                  "new_event",
                  RichEvent { raw, parsed },
                )
                .is_err()
              {
                println!("Emit new notification failed.")
              }
            } else {
              println!("new event: {}", event.as_json())
            }
          } else {
            println!("new message: {}", message.as_json())
          }
        }
        Ok(false)
      })
      .await
  });

  Ok(true)
}
