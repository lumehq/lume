#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

pub mod commands;
pub mod fns;
pub mod nostr;

#[cfg(target_os = "macos")]
extern crate cocoa;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use nostr_sdk::prelude::*;
use std::fs;
use tauri::Manager;
use tauri_nspanel::ManagerExt;
use tauri_plugin_decorum::WebviewWindowExt;

#[cfg(target_os = "macos")]
use crate::fns::{
  position_menubar_panel, setup_menubar_panel_listeners, swizzle_to_menubar_panel,
  update_menubar_appearance,
};

#[cfg(target_os = "macos")]
use tauri::tray::{MouseButtonState, TrayIconEvent};

pub struct Nostr {
  client: Client,
}

fn main() {
  let mut ctx = tauri::generate_context!();
  let invoke_handler = {
    let builder = tauri_specta::ts::builder().commands(tauri_specta::collect_commands![
      nostr::relay::get_relays,
      nostr::relay::connect_relay,
      nostr::relay::remove_relay,
      nostr::keys::get_accounts,
      nostr::keys::create_account,
      nostr::keys::save_account,
      nostr::keys::get_encrypted_key,
      nostr::keys::connect_remote_account,
      nostr::keys::load_account,
      nostr::keys::event_to_bech32,
      nostr::keys::user_to_bech32,
      nostr::keys::verify_nip05,
      nostr::metadata::get_current_user_profile,
      nostr::metadata::get_profile,
      nostr::metadata::get_contact_list,
      nostr::metadata::set_contact_list,
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
      nostr::metadata::get_notifications,
      nostr::event::get_event,
      nostr::event::get_replies,
      nostr::event::get_events_by,
      nostr::event::get_local_events,
      nostr::event::get_global_events,
      nostr::event::get_hashtag_events,
      nostr::event::publish,
      nostr::event::repost,
      commands::folder::show_in_folder,
      commands::window::create_column,
      commands::window::close_column,
      commands::window::reposition_column,
      commands::window::resize_column,
      commands::window::open_window,
      commands::window::set_badge
    ]);

    #[cfg(debug_assertions)]
    let builder = builder.path("../packages/system/src/commands.ts");

    builder.build().unwrap()
  };

  tauri::Builder::default()
    .setup(|app| {
      let main_window = app.get_webview_window("main").unwrap();

      // Create a custom titlebar for Windows
      #[cfg(target_os = "windows")]
      main_window.create_overlay_titlebar().unwrap();

      // Set a custom inset to the traffic lights
      #[cfg(target_os = "macos")]
      main_window.set_traffic_lights_inset(8.0, 16.0).unwrap();

      // Create panel
      #[cfg(target_os = "macos")]
      swizzle_to_menubar_panel(&app.handle());
      #[cfg(target_os = "macos")]
      update_menubar_appearance(&app.handle());
      #[cfg(target_os = "macos")]
      setup_menubar_panel_listeners(&app.handle());

      // Setup tray icon
      #[cfg(target_os = "macos")]
      let tray = app.tray_by_id("tray_panel").unwrap();

      // Handle tray icon event
      #[cfg(target_os = "macos")]
      tray.on_tray_icon_event(|tray, event| match event {
        TrayIconEvent::Click { button_state, .. } => {
          if button_state == MouseButtonState::Up {
            let app = tray.app_handle();
            let panel = app.get_webview_panel("panel").unwrap();

            match panel.is_visible() {
              true => panel.order_out(None),
              false => {
                position_menubar_panel(&app, 0.0);
                panel.show();
              }
            }
          }
        }
        _ => {}
      });

      // Create data folder if not exist
      let home_dir = app.path().home_dir().unwrap();
      let _ = fs::create_dir_all(home_dir.join("Lume/"));

      tauri::async_runtime::block_on(async move {
        // Create nostr connection
        let database = SQLiteDatabase::open(home_dir.join("Lume/lume.db")).await;
        let client = match database {
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
        app.handle().manage(Nostr { client })
      });

      Ok(())
    })
    .plugin(tauri_nspanel::init())
    .plugin(tauri_plugin_theme::init(ctx.config_mut()))
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
    .invoke_handler(invoke_handler)
    .run(ctx)
    .expect("error while running tauri application")
}
