#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

pub mod commands;
pub mod nostr;
pub mod tray;

#[cfg(target_os = "macos")]
extern crate cocoa;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use nostr_sdk::prelude::*;
use std::fs;
use tauri::Manager;
use tauri_plugin_decorum::WebviewWindowExt;

pub struct Nostr {
  client: Client,
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      // Create a custom titlebar for main window
      let main_window = app.get_webview_window("main").unwrap();
      main_window.create_overlay_titlebar().unwrap();

      // Set a custom inset to the traffic lights
      #[cfg(target_os = "macos")]
      main_window.set_traffic_lights_inset(8.0, 16.0).unwrap();

      // Setup app tray
      let handle = app.handle().clone();
      tray::create_tray(app.handle()).unwrap();

      // Create data folder if not exist
      let home_dir = app.path().home_dir().unwrap();
      fs::create_dir_all(home_dir.join("Lume/")).unwrap();

      tauri::async_runtime::block_on(async move {
        // Create nostr database connection
        let sqlite = SQLiteDatabase::open(home_dir.join("Lume/lume.db")).await;

        // Create nostr connection
        let client = match sqlite {
          Ok(db) => ClientBuilder::default().database(db).build(),
          Err(_) => ClientBuilder::default().build(),
        };

        // Add bootstrap relays
        client
          .add_relay("wss://relay.nostr.net")
          .await
          .expect("Cannot connect to relay.nostr.net, please try again later.");
        client
          .add_relay("wss://relay.damus.io")
          .await
          .expect("Cannot connect to relay.damus.io, please try again later.");
        client
          .add_relay_with_opts(
            "wss://directory.yabu.me/",
            RelayOptions::new().read(true).write(false),
          )
          .await
          .expect("Cannot connect to directory.yabu.me, please try again later.");

        // Connect
        client.connect().await;

        // Update global state
        handle.manage(Nostr { client })
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
    .plugin(tauri_plugin_decorum::init())
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
    .invoke_handler(tauri::generate_handler![
      nostr::relay::get_relays,
      nostr::relay::connect_relay,
      nostr::relay::remove_relay,
      nostr::keys::create_keys,
      nostr::keys::save_key,
      nostr::keys::get_encrypted_key,
      nostr::keys::get_stored_nsec,
      nostr::keys::nostr_connect,
      nostr::keys::load_selected_account,
      nostr::keys::event_to_bech32,
      nostr::keys::user_to_bech32,
      nostr::keys::to_npub,
      nostr::keys::verify_nip05,
      nostr::metadata::run_notification,
      nostr::metadata::get_activities,
      nostr::metadata::get_current_user_profile,
      nostr::metadata::get_profile,
      nostr::metadata::get_contact_list,
      nostr::metadata::create_profile,
      nostr::metadata::follow,
      nostr::metadata::unfollow,
      nostr::metadata::get_nstore,
      nostr::metadata::set_nstore,
      nostr::metadata::set_nwc,
      nostr::metadata::load_nwc,
      nostr::metadata::get_balance,
      nostr::metadata::zap_profile,
      nostr::metadata::zap_event,
      nostr::metadata::friend_to_friend,
      nostr::event::get_event,
      nostr::event::get_events_from,
      nostr::event::get_events,
      nostr::event::get_events_from_interests,
      nostr::event::get_event_thread,
      nostr::event::publish,
      nostr::event::repost,
      commands::folder::show_in_folder,
      commands::folder::get_accounts,
      commands::window::create_column,
      commands::window::close_column,
      commands::window::reposition_column,
      commands::window::resize_column,
      commands::window::open_window,
      commands::window::set_badge,
      commands::opg::fetch_opg,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application")
}
