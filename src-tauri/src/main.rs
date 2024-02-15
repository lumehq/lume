#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

pub mod commands;
pub mod nostr;

use age::secrecy::ExposeSecret;
use keyring::Entry;
use nostr_sdk::prelude::*;
use std::error::Error;
use std::fs::File;
use std::io::{BufReader, Read};
use std::iter;
use std::path::Path;
use std::path::PathBuf;
use std::str::FromStr;
use std::sync::Arc;
use std::time::Duration;
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;

pub struct Nostr {
  pub client: Arc<Client>,
  pub client_user: Option<XOnlyPublicKey>,
  pub contact_list: Option<Vec<Contact>>,
}

fn main() {
  #[cfg(debug_assertions)]
  let devtools = tauri_plugin_devtools::init();

  let mut ctx = tauri::generate_context!();

  tauri::Builder::default()
    .setup(|app| {
      let handle = app.handle().clone();
      let config_dir = handle.path().app_config_dir().unwrap();

      let keyring_entry = Entry::new("Lume Secret Storage", "AppKey").unwrap();
      let mut stored_nsec_key = None;

      if let Ok(key) = keyring_entry.get_password() {
        let app_key = age::x25519::Identity::from_str(&key.to_string()).unwrap();
        if let Ok(nsec_paths) = get_nsec_paths(config_dir.as_path()) {
          let last_nsec_path = nsec_paths.last();
          if let Some(nsec_path) = last_nsec_path {
            let file = File::open(nsec_path).expect("Open nsec file failed");
            let file_buf = BufReader::new(file);
            let decryptor = match age::Decryptor::new_buffered(file_buf).expect("Decryptor failed")
            {
              age::Decryptor::Recipients(d) => d,
              _ => unreachable!(),
            };

            let mut decrypted = vec![];
            let mut reader = decryptor
              .decrypt(iter::once(&app_key as &dyn age::Identity))
              .expect("Decrypt nsec file failed");
            reader
              .read_to_end(&mut decrypted)
              .expect("Read secret key failed");

            stored_nsec_key = Some(String::from_utf8(decrypted).expect("Not valid"))
          }
        }
      } else {
        let app_key = age::x25519::Identity::generate().to_string();
        let app_secret = app_key.expose_secret();
        let _ = keyring_entry.set_password(app_secret);
      }

      tauri::async_runtime::spawn(async move {
        // Create nostr database connection
        let nostr_db = SQLiteDatabase::open(config_dir.join("nostr.db"))
          .await
          .expect("Open database failed.");

        // Create nostr connection
        let client = ClientBuilder::default().database(nostr_db).build();

        // Add some bootstrap relays
        // #TODO: Pull bootstrap relays from user's settings
        client
          .add_relay("wss://nostr.mutinywallet.com")
          .await
          .expect("Failed to add bootstrap relay.");
        client
          .add_relay("wss://bostr.nokotaro.com")
          .await
          .expect("Failed to add bootstrap relay.");

        // Connect
        client.connect().await;

        // Prepare contact list
        let mut user = None;
        let mut contact_list = None;

        // Run somethings if account existed
        if let Some(key) = stored_nsec_key {
          let secret_key = SecretKey::from_bech32(key).expect("Get secret key failed");
          let keys = Keys::new(secret_key);
          let public_key = keys.public_key();
          let signer = ClientSigner::Keys(keys);

          // Update client's signer
          client.set_signer(Some(signer)).await;

          // Update user
          user = Some(public_key);

          // Get contact list
          contact_list = Some(
            client
              .get_contact_list(Some(Duration::from_secs(10)))
              .await
              .unwrap(),
          );
        };

        // Init global state
        handle.manage(Nostr {
          client: client.into(),
          client_user: user.into(),
          contact_list: contact_list.into(),
        })
      });

      Ok(())
    })
    .plugin(devtools)
    .plugin(tauri_plugin_store::Builder::default().build())
    .plugin(tauri_plugin_theme::init(ctx.config_mut()))
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_upload::init())
    .plugin(tauri_plugin_updater::Builder::new().build())
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .plugin(tauri_plugin_autostart::init(
      MacosLauncher::LaunchAgent,
      Some(vec![]),
    ))
    .invoke_handler(tauri::generate_handler![
      nostr::keys::create_keys,
      nostr::keys::save_key,
      nostr::keys::get_public_key,
      nostr::keys::update_signer,
      nostr::keys::verify_signer,
      nostr::keys::load_account,
      nostr::keys::event_to_bech32,
      nostr::keys::user_to_bech32,
      nostr::keys::verify_nip05,
      nostr::metadata::get_profile,
      nostr::metadata::create_profile,
      nostr::event::get_event,
      nostr::event::get_text_events,
      nostr::event::get_event_thread,
      nostr::event::publish,
      nostr::event::reply_to,
      nostr::event::repost,
      nostr::event::upvote,
      nostr::event::downvote,
      commands::folder::show_in_folder,
      commands::opg::fetch_opg,
    ])
    .build(ctx)
    .expect("error while running tauri application")
    .run(|_app_handle, event| match event {
      tauri::RunEvent::ExitRequested { api, .. } => {
        api.prevent_exit();
      }
      _ => {}
    });
}

fn get_nsec_paths(dir: &Path) -> Result<Vec<PathBuf>, Box<dyn Error>> {
  let paths = std::fs::read_dir(dir)?
    .filter_map(|res| res.ok())
    .map(|dir_entry| dir_entry.path())
    .filter_map(|path| {
      if path.extension().map_or(false, |ext| ext == "nsec") {
        Some(path)
      } else {
        None
      }
    })
    .collect::<Vec<_>>();

  Ok(paths)
}
