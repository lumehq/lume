#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
use border::WebviewWindowExt as BorderWebviewWindowExt;
use commands::{account::*, event::*, metadata::*, relay::*, window::*};
use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use specta_typescript::Typescript;
use std::{
    fs,
    io::{self, BufRead},
    str::FromStr,
    time::Duration,
};
use tauri::{path::BaseDirectory, Manager};
use tauri_plugin_decorum::WebviewWindowExt;
use tauri_specta::{collect_commands, Builder};
use tokio::sync::Mutex;

pub mod commands;
pub mod common;
#[cfg(target_os = "macos")]
pub mod macos;

pub struct Nostr {
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
    let builder = Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(collect_commands![
            get_relays,
            connect_relay,
            remove_relay,
            get_bootstrap_relays,
            save_bootstrap_relays,
            get_accounts,
            create_account,
            import_account,
            connect_account,
            delete_account,
            login,
            get_profile,
            get_contact_list,
            set_contact_list,
            create_profile,
            is_contact_list_empty,
            check_contact,
            toggle_contact,
            get_nstore,
            set_nstore,
            set_wallet,
            load_wallet,
            remove_wallet,
            zap_profile,
            zap_event,
            friend_to_friend,
            get_notifications,
            get_settings,
            set_new_settings,
            verify_nip05,
            get_event_meta,
            get_event,
            get_event_from,
            get_replies,
            listen_event_reply,
            get_events_by,
            get_local_events,
            get_group_events,
            get_global_events,
            get_hashtag_events,
            publish,
            reply,
            repost,
            event_to_bech32,
            user_to_bech32,
            unlisten,
            create_column,
            close_column,
            reposition_column,
            resize_column,
            reload_column,
            open_window,
            reopen_lume,
            quit
        ]);

    builder
        .export(Typescript::default(), "../src/commands.gen.ts")
        .expect("Failed to export typescript bindings");

    #[cfg(target_os = "macos")]
    let tauri_builder = tauri::Builder::default().plugin(tauri_nspanel::init());

    #[cfg(not(target_os = "macos"))]
    let tauri_builder = tauri::Builder::default();

    let mut ctx = tauri::generate_context!();

    tauri_builder
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);

            #[cfg(target_os = "macos")]
            app.handle().plugin(tauri_nspanel::init()).unwrap();

            let handle = app.handle();
            let main_window = app.get_webview_window("main").unwrap();

            // Set custom decoration for Windows
            #[cfg(target_os = "windows")]
            main_window.create_overlay_titlebar().unwrap();

            // Restore native border
            #[cfg(target_os = "macos")]
            main_window.add_border(None);

            // Set a custom inset to the traffic lights
            #[cfg(target_os = "macos")]
            main_window.set_traffic_lights_inset(7.0, 10.0).unwrap();

            #[cfg(target_os = "macos")]
            let win = main_window.clone();

            #[cfg(target_os = "macos")]
            main_window.on_window_event(move |event| {
                if let tauri::WindowEvent::ThemeChanged(_) = event {
                    win.set_traffic_lights_inset(7.0, 10.0).unwrap();
                }
            });

            // Create data folder if not exist
            let home_dir = app.path().home_dir().unwrap();
            let _ = fs::create_dir_all(home_dir.join("Lume/"));

            let client = tauri::async_runtime::block_on(async move {
                // Setup database
                let database = SQLiteDatabase::open(home_dir.join("Lume/lume.db"))
                    .await
                    .expect("Error.");

                // Config
                let opts = Options::new()
                    .automatic_authentication(true)
                    .connection_timeout(Some(Duration::from_secs(5)))
                    .timeout(Duration::from_secs(30));

                // Setup nostr client
                let client = ClientBuilder::default()
                    .database(database)
                    .opts(opts)
                    .build();

                // Get bootstrap relays
                if let Ok(path) = handle
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

                client
            });

            // Create global state
            app.manage(Nostr {
                client,
                contact_list: Mutex::new(vec![]),
                settings: Mutex::new(Settings::default()),
            });

            Ok(())
        })
        .plugin(prevent_default())
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
        .run(ctx)
        .expect("error while running tauri application");
}

#[cfg(debug_assertions)]
fn prevent_default() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    use tauri_plugin_prevent_default::Flags;

    tauri_plugin_prevent_default::Builder::new()
        .with_flags(Flags::all().difference(Flags::CONTEXT_MENU))
        .build()
}

#[cfg(not(debug_assertions))]
fn prevent_default() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    tauri_plugin_prevent_default::Builder::new().build()
}
