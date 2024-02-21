#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

pub mod commands;
pub mod nostr;

use age::secrecy::ExposeSecret;
use keyring::Entry;
use nostr_sdk::prelude::*;
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;
use tokio::sync::Mutex;

pub struct Nostr {
  client: Mutex<Client>,
  contact_list: Mutex<Option<Vec<PublicKey>>>,
}

fn main() {
  let mut ctx = tauri::generate_context!();
  tauri::Builder::default()
    .setup(|app| {
      let handle = app.handle().clone();
      let config_dir = handle.path().app_config_dir().unwrap();
      let keyring_entry = Entry::new("Lume Secret Storage", "AppKey").unwrap();

      // Create new master key if not exist
      if let Err(_) = keyring_entry.get_password() {
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
          .add_relay("wss://bostr.yonle.lecturify.net")
          .await
          .expect("Failed to add bootstrap relay.");
        client
          .add_relay("wss://purplepag.es")
          .await
          .expect("Failed to add bootstrap relay.");

        // Connect
        client.connect().await;

        // Update global state
        handle.manage(Nostr {
          client: Mutex::new(client),
          contact_list: Mutex::new(None),
        })
      });

      Ok(())
    })
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
      nostr::keys::load_selected_account,
      nostr::keys::event_to_bech32,
      nostr::keys::user_to_bech32,
      nostr::keys::verify_nip05,
      nostr::metadata::get_profile,
      nostr::metadata::get_contact_list,
      nostr::metadata::create_profile,
      nostr::metadata::follow,
      nostr::metadata::unfollow,
      nostr::metadata::set_interest,
      nostr::metadata::get_interest,
      nostr::metadata::set_settings,
      nostr::metadata::get_settings,
      nostr::event::get_event,
      nostr::event::get_local_events,
      nostr::event::get_global_events,
      nostr::event::get_event_thread,
      nostr::event::publish,
      nostr::event::reply_to,
      nostr::event::repost,
      nostr::event::upvote,
      nostr::event::downvote,
      commands::folder::show_in_folder,
      commands::folder::get_all_nsecs,
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
