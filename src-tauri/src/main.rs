#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

pub mod commands;
pub mod db;
pub mod nostr;

use crate::db::api::v1::AccountKey;
use crate::db::DATABASE_BUILDER;
use db::api::v1::Account;
use keyring::Entry;
use nostr_sdk::prelude::*;
use std::sync::Arc;
use std::time::Duration;
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;

pub struct Nostr {
  pub client: Arc<Client>,
  pub contact_list: Option<Vec<Contact>>,
}

fn main() {
  let mut ctx = tauri::generate_context!();
  tauri::Builder::default()
    .setup(|app| {
      let handle = app.handle().clone();
      let config_dir = handle.path().app_config_dir().unwrap();

      tauri::async_runtime::spawn(async move {
        // Create nostr database connection
        let nostr_db = SQLiteDatabase::open(config_dir.join("nostr.db"))
          .await
          .expect("Open database failed.");

        // Create nostr connection
        let client = ClientBuilder::default().database(nostr_db).build();

        // Create app database connection
        let db = DATABASE_BUILDER
          .create(config_dir.join("app.db"))
          .expect("failed to create app database");

        // Run migration for app database
        let rw = db
          .rw_transaction()
          .expect("failed to create rw migration transaction");
        rw.migrate::<Account>().expect("failed to migrate Account");
        rw.commit().expect("failed to commit migration");

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

        // Get stored account
        let r = db.r_transaction().expect("failed to create ro transaction");
        let accounts: Vec<Account> = r
          .scan()
          .secondary(AccountKey::status)
          .expect("failed to scan accounts")
          .start_with("active")
          .collect();
        let mut contact_list = None;

        // Run somethings if account existed
        if let Some(account) = accounts.into_iter().nth(0) {
          // Add signer with stored private key
          let entry = Entry::new("Lume", &account.pubkey).expect("failed to load secret");

          if let Ok(key) = entry.get_password() {
            let secret_key = SecretKey::from_bech32(key).unwrap();
            let keys = Keys::new(secret_key);
            let signer = ClientSigner::Keys(keys);

            // Update client's signer
            client.set_signer(Some(signer)).await;

            // Get contact list
            contact_list = Some(
              client
                .get_contact_list(Some(Duration::from_secs(10)))
                .await
                .unwrap(),
            );
          }
        }

        // Init global state
        handle.manage(Nostr {
          client: client.into(),
          contact_list: contact_list.into(),
        })
      });

      Ok(())
    })
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
      nostr::keys::get_public_key,
      nostr::keys::update_signer,
      nostr::keys::verify_signer,
      nostr::keys::event_to_bech32,
      nostr::keys::user_to_bech32,
      nostr::metadata::get_profile,
      nostr::event::get_event,
      nostr::event::get_text_events,
      nostr::event::get_event_thread,
      nostr::event::publish,
      nostr::event::reply_to,
      nostr::event::repost,
      nostr::event::upvote,
      nostr::event::downvote,
      commands::secret::secure_save,
      commands::secret::secure_load,
      commands::secret::secure_remove,
      commands::folder::show_in_folder,
      commands::opg::fetch_opg,
    ])
    .run(ctx)
    .expect("error while running tauri application");
}
