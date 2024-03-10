#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

pub mod commands;
pub mod nostr;
pub mod tray;

use std::fs;

use nostr_sdk::prelude::*;
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;

pub struct Nostr {
  client: Client,
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let _tray = tray::create_tray(app.handle()).unwrap();
      let handle = app.handle().clone();
      let home_dir = handle.path().home_dir().unwrap();

      // create data folder if not exist
      fs::create_dir_all(home_dir.join("Lume/")).unwrap();

      tauri::async_runtime::spawn(async move {
        // Create nostr database connection
        let sqlite = SQLiteDatabase::open(home_dir.join("Lume/lume.db")).await;

        // Create nostr connection
        let client = match sqlite {
          Ok(db) => ClientBuilder::default().database(db).build(),
          Err(_) => ClientBuilder::default().build(),
        };

        // Add some bootstrap relays
        // #TODO: Pull bootstrap relays from user's settings
        client
          .add_relay("wss://nostr.mutinywallet.com")
          .await
          .unwrap_or_default();
        client
          .add_relay("wss://relay.nostr.band")
          .await
          .unwrap_or_default();
        client
          .add_relay("wss://relay.damus.io")
          .await
          .unwrap_or_default();
        client
          .add_relay("wss://purplepag.es")
          .await
          .unwrap_or_default();

        // Connect
        client.connect().await;

        // Update global state
        handle.manage(Nostr {
          client: client.into(),
        })
      });

      Ok(())
    })
    .plugin(tauri_plugin_store::Builder::default().build())
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
      nostr::keys::get_encrypted_key,
      nostr::keys::verify_signer,
      nostr::keys::load_selected_account,
      nostr::keys::event_to_bech32,
      nostr::keys::user_to_bech32,
      nostr::keys::verify_nip05,
      nostr::metadata::get_profile,
      nostr::metadata::get_contact_list,
      nostr::metadata::get_contact_metadata,
      nostr::metadata::create_profile,
      nostr::metadata::follow,
      nostr::metadata::unfollow,
      nostr::metadata::set_interest,
      nostr::metadata::get_interest,
      nostr::metadata::set_settings,
      nostr::metadata::get_settings,
      nostr::metadata::get_nwc_status,
      nostr::metadata::set_nwc,
      nostr::metadata::nwc_status,
      nostr::metadata::zap_profile,
      nostr::metadata::zap_event,
      nostr::event::get_event,
      nostr::event::get_events_from,
      nostr::event::get_local_events,
      nostr::event::get_global_events,
      nostr::event::get_event_thread,
      nostr::event::publish,
      nostr::event::repost,
      nostr::event::upvote,
      nostr::event::downvote,
      commands::folder::show_in_folder,
      commands::folder::get_accounts,
      commands::opg::fetch_opg,
    ])
    .build(tauri::generate_context!())
    .expect("error while running tauri application")
    .run(
      #[allow(unused_variables)]
      |app, event| {
        #[cfg(any(target_os = "macos"))]
        if let tauri::RunEvent::Opened { urls } = event {
          if let Some(w) = app.get_webview_window("main") {
            let urls = urls
              .iter()
              .map(|u| u.as_str())
              .collect::<Vec<_>>()
              .join(",");
            let _ = w.eval(&format!("window.onFileOpen(`{urls}`)"));
          }
        }
      },
    );
}
