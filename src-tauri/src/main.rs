#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
extern crate cocoa;
#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

#[cfg(target_os = "macos")]
use border::WebviewWindowExt as BorderWebviewWindowExt;
use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::sync::Mutex;
use std::time::Duration;
use std::{
    fs,
    io::{self, BufRead},
    str::FromStr,
};
use tauri::{path::BaseDirectory, Manager};
#[cfg(not(target_os = "linux"))]
use tauri_plugin_decorum::WebviewWindowExt;

pub mod commands;
pub mod nostr;

#[derive(Serialize)]
pub struct Nostr {
    #[serde(skip_serializing)]
    client: Client,
    contact_list: Mutex<Vec<Contact>>,
    settings: Mutex<Settings>,
}

#[derive(Clone, Serialize, Deserialize, Type)]
pub struct Settings {
    proxy: Option<String>,
    image_resize_service: Option<String>,
    use_relay_hint: bool,
    content_warning: bool,
    display_avatar: bool,
    display_zap_button: bool,
    display_repost_button: bool,
    display_media: bool,
    vibrancy: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            proxy: None,
            image_resize_service: Some("https://wsrv.nl/".into()),
            use_relay_hint: true,
            content_warning: true,
            display_avatar: true,
            display_zap_button: true,
            display_repost_button: true,
            display_media: true,
            vibrancy: true,
        }
    }
}

pub const FETCH_LIMIT: usize = 20;
pub const NEWSFEED_NEG_LIMIT: usize = 256;
pub const NOTIFICATION_NEG_LIMIT: usize = 64;

fn main() {
    let mut ctx = tauri::generate_context!();

    let invoke_handler = {
        let builder = tauri_specta::ts::builder().commands(tauri_specta::collect_commands![
            nostr::relay::get_relays,
            nostr::relay::connect_relay,
            nostr::relay::remove_relay,
            nostr::relay::get_bootstrap_relays,
            nostr::relay::save_bootstrap_relays,
            nostr::keys::get_accounts,
            nostr::keys::create_account,
            nostr::keys::save_account,
            nostr::keys::get_encrypted_key,
            nostr::keys::get_private_key,
            nostr::keys::connect_remote_account,
            nostr::keys::load_account,
            nostr::metadata::get_current_profile,
            nostr::metadata::get_profile,
            nostr::metadata::get_contact_list,
            nostr::metadata::set_contact_list,
            nostr::metadata::create_profile,
            nostr::metadata::is_contact_list_empty,
            nostr::metadata::check_contact,
            nostr::metadata::toggle_contact,
            nostr::metadata::get_nstore,
            nostr::metadata::set_nstore,
            nostr::metadata::set_wallet,
            nostr::metadata::load_wallet,
            nostr::metadata::remove_wallet,
            nostr::metadata::zap_profile,
            nostr::metadata::zap_event,
            nostr::metadata::friend_to_friend,
            nostr::metadata::get_notifications,
            nostr::metadata::get_settings,
            nostr::metadata::set_new_settings,
            nostr::metadata::verify_nip05,
            nostr::event::get_event_meta,
            nostr::event::get_event,
            nostr::event::get_event_from,
            nostr::event::get_replies,
            nostr::event::listen_event_reply,
            nostr::event::get_events_by,
            nostr::event::get_local_events,
            nostr::event::listen_local_event,
            nostr::event::get_group_events,
            nostr::event::get_global_events,
            nostr::event::get_hashtag_events,
            nostr::event::publish,
            nostr::event::reply,
            nostr::event::repost,
            nostr::event::event_to_bech32,
            nostr::event::user_to_bech32,
            nostr::event::unlisten,
            commands::window::create_column,
            commands::window::close_column,
            commands::window::reposition_column,
            commands::window::resize_column,
            commands::window::reload_column,
            commands::window::open_window,
            commands::window::open_main_window,
            commands::window::force_quit,
            commands::window::set_badge
        ]);

        #[cfg(debug_assertions)]
        let builder = builder.path("../packages/system/src/commands.ts");

        builder.build().unwrap()
    };

    #[cfg(target_os = "macos")]
    let builder = tauri::Builder::default().plugin(tauri_nspanel::init());

    #[cfg(not(target_os = "macos"))]
    let builder = tauri::Builder::default();

    builder
        .setup(|app| {
            #[cfg(target_os = "macos")]
            app.handle().plugin(tauri_nspanel::init()).unwrap();

            #[cfg(not(target_os = "linux"))]
            let main_window = app.get_webview_window("main").unwrap();

            // Set custom decoration for Windows
            #[cfg(target_os = "windows")]
            main_window.create_overlay_titlebar().unwrap();

            // Restore native border
            #[cfg(target_os = "macos")]
            main_window.add_border(None);

            // Set a custom inset to the traffic lights
            #[cfg(target_os = "macos")]
            main_window.set_traffic_lights_inset(8.0, 16.0).unwrap();

            #[cfg(target_os = "macos")]
            let win = main_window.clone();

            #[cfg(target_os = "macos")]
            main_window.on_window_event(move |event| {
                if let tauri::WindowEvent::ThemeChanged(_) = event {
                    win.set_traffic_lights_inset(8.0, 16.0).unwrap();
                }
                if let tauri::WindowEvent::Resized(_) = event {
                    win.set_traffic_lights_inset(8.0, 16.0).unwrap();
                }
            });

            // Create data folder if not exist
            let home_dir = app.path().home_dir().unwrap();
            let _ = fs::create_dir_all(home_dir.join("Lume/"));

            tauri::async_runtime::block_on(async move {
                // Setup database
                let database = SQLiteDatabase::open(home_dir.join("Lume/lume.db")).await;

                // Config
                let opts = Options::new()
                    .automatic_authentication(true)
                    .connection_timeout(Some(Duration::from_secs(5)))
                    .timeout(Duration::from_secs(30));

                // Setup nostr client
                let client = match database {
                    Ok(db) => ClientBuilder::default().database(db).opts(opts).build(),
                    Err(_) => ClientBuilder::default().opts(opts).build(),
                };

                // Get bootstrap relays
                if let Ok(path) = app
                    .path()
                    .resolve("resources/relays.txt", BaseDirectory::Resource)
                {
                    let file = std::fs::File::open(&path).unwrap();
                    let lines = io::BufReader::new(file).lines();

                    // Add bootstrap relays to relay pool
                    for line in lines.map_while(Result::ok) {
                        if let Some((relay, option)) = line.split_once(',') {
                            match RelayMetadata::from_str(option) {
                                Ok(meta) => {
                                    println!(
                                        "connecting to bootstrap relay...: {} - {}",
                                        relay, meta
                                    );
                                    let opts = if meta == RelayMetadata::Read {
                                        RelayOptions::new().read(true).write(false)
                                    } else {
                                        RelayOptions::new().write(true).read(false)
                                    };
                                    let _ = client.add_relay_with_opts(relay, opts).await;
                                }
                                Err(_) => {
                                    println!("connecting to bootstrap relay...: {}", relay);
                                    let _ = client.add_relay(relay).await;
                                }
                            }
                        }
                    }
                }

                // Connect
                client.connect().await;

                // Update global state
                app.handle().manage(Nostr {
                    client,
                    contact_list: Mutex::new(vec![]),
                    settings: Mutex::new(Settings::default()),
                })
            });

            Ok(())
        })
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
        .expect("error while running tauri application");
}
