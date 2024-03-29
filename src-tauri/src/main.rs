#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

pub mod commands;
pub mod nostr;
pub mod traffic_light;
pub mod tray;

#[cfg(target_os = "macos")]
extern crate cocoa;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use nostr_sdk::prelude::*;
use std::fs;
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;
use traffic_light::setup_traffic_light_positioner;

pub struct Nostr {
  client: Client,
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      #[cfg(target_os = "macos")]
      app.set_activation_policy(tauri::ActivationPolicy::Regular);

      #[cfg(target_os = "macos")]
      setup_traffic_light_positioner(app.get_window("main").unwrap());

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
    .on_window_event(|window, event| match event {
      tauri::WindowEvent::CloseRequested { api, .. } => {
        window.hide().unwrap();
        api.prevent_close();
      }
      _ => {}
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
      nostr::metadata::set_nwc,
      nostr::metadata::load_nwc,
      nostr::metadata::get_balance,
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
      commands::window::create_column,
      commands::window::close_column,
      commands::window::reposition_column
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application")
}
