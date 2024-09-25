#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
use border::WebviewWindowExt as BorderWebviewWindowExt;
use commands::{account::*, event::*, metadata::*, relay::*, window::*};
use common::parse_event;
use nostr_relay_builder::prelude::*;
use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use specta_typescript::Typescript;
use std::{
    collections::HashMap,
    fs,
    io::{self, BufRead},
    str::FromStr,
    time::Duration,
};
use tauri::{path::BaseDirectory, Emitter, EventTarget, Manager};
use tauri_plugin_decorum::WebviewWindowExt;
use tauri_plugin_notification::{NotificationExt, PermissionState};
use tauri_specta::{collect_commands, collect_events, Builder, Event as TauriEvent};
use tokio::sync::Mutex;

pub mod commands;
pub mod common;

pub struct Nostr {
    client: Client,
    contact_list: Mutex<Vec<Contact>>,
    settings: Mutex<Settings>,
    circles: Mutex<HashMap<PublicKey, Vec<PublicKey>>>,
}

#[derive(Clone, Serialize, Deserialize, Type)]
pub struct Settings {
    proxy: Option<String>,
    image_resize_service: Option<String>,
    use_relay_hint: bool,
    content_warning: bool,
    trusted_only: bool,
    display_avatar: bool,
    display_zap_button: bool,
    display_repost_button: bool,
    display_media: bool,
    transparent: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            proxy: None,
            image_resize_service: Some("https://wsrv.nl".to_string()),
            use_relay_hint: true,
            content_warning: true,
            trusted_only: true,
            display_avatar: true,
            display_zap_button: true,
            display_repost_button: true,
            display_media: true,
            transparent: true,
        }
    }
}

#[derive(Serialize, Deserialize, Type)]
enum SubKind {
    Subscribe,
    Unsubscribe,
}

#[derive(Serialize, Deserialize, Type, TauriEvent)]
struct Subscription {
    label: String,
    kind: SubKind,
    event_id: Option<String>,
}

#[derive(Serialize, Deserialize, Type, Clone, TauriEvent)]
struct NewSettings(Settings);

pub const DEFAULT_DIFFICULTY: u8 = 21;
pub const FETCH_LIMIT: usize = 20;
pub const NEWSFEED_NEG_LIMIT: usize = 256;
pub const NOTIFICATION_NEG_LIMIT: usize = 64;
pub const NOTIFICATION_SUB_ID: &str = "lume_notification";

fn main() {
    #[cfg(debug_assertions)]
    tracing_subscriber::fmt::init();

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
            get_private_key,
            delete_account,
            reset_password,
            login,
            get_profile,
            set_profile,
            get_contact_list,
            set_contact_list,
            is_contact_list_empty,
            check_contact,
            toggle_contact,
            get_lume_store,
            set_lume_store,
            set_wallet,
            load_wallet,
            remove_wallet,
            zap_profile,
            zap_event,
            copy_friend,
            get_notifications,
            get_settings,
            set_settings,
            verify_nip05,
            is_trusted_user,
            get_event_meta,
            get_event,
            get_event_from,
            get_replies,
            subscribe_to,
            get_events_by,
            get_events_from_contacts,
            get_group_events,
            get_global_events,
            get_hashtag_events,
            search,
            publish,
            reply,
            repost,
            event_to_bech32,
            user_to_bech32,
            create_column,
            close_column,
            reposition_column,
            resize_column,
            reload_column,
            open_window,
            reopen_lume,
            quit
        ])
        .events(collect_events![Subscription, NewSettings]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/commands.gen.ts")
        .expect("Failed to export typescript bindings");

    #[cfg(target_os = "macos")]
    let tauri_builder = tauri::Builder::default().plugin(tauri_nspanel::init());

    #[cfg(not(target_os = "macos"))]
    let tauri_builder = tauri::Builder::default();

    tauri_builder
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);

            let handle = app.handle();
            let handle_clone = handle.clone();
            let handle_clone_child = handle_clone.clone();
            let main_window = app.get_webview_window("main").unwrap();

            let config_dir = handle
                .path()
                .app_config_dir()
                .expect("Error: app config directory not found.");

            let data_dir = handle
                .path()
                .app_data_dir()
                .expect("Error: app data directory not found.");

            let _ = fs::create_dir_all(&config_dir);
            let _ = fs::create_dir_all(&data_dir);

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

            let client = tauri::async_runtime::block_on(async move {
                // Setup database
                let database = NostrLMDB::open(config_dir.join("nostr-lmdb"))
                    .expect("Error: cannot create database.");

                // Config
                let opts = Options::new()
                    .gossip(true)
                    .max_avg_latency(Duration::from_millis(500))
                    .automatic_authentication(false)
                    .connection_timeout(Some(Duration::from_secs(5)))
                    .send_timeout(Some(Duration::from_secs(5)))
                    .timeout(Duration::from_secs(5));

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
                                    let opts = if meta == RelayMetadata::Read {
                                        RelayOptions::new().read(true).write(false)
                                    } else {
                                        RelayOptions::new().write(true).read(false)
                                    };
                                    let _ = client.pool().add_relay(relay, opts).await;
                                }
                                Err(_) => {
                                    let _ = client.add_relay(relay).await;
                                }
                            }
                        }
                    }
                }

                if let Err(e) = client.add_discovery_relay("wss://purplepag.es/").await {
                    println!("Add discovery relay failed: {}", e)
                }

                if let Err(e) = client.add_discovery_relay("wss://directory.yabu.me/").await {
                    println!("Add discovery relay failed: {}", e)
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
                circles: Mutex::new(HashMap::new()),
            });

            Subscription::listen_any(app, move |event| {
                let handle = handle_clone_child.to_owned();
                let payload = event.payload;

                tauri::async_runtime::spawn(async move {
                    let state = handle.state::<Nostr>();
                    let client = &state.client;

                    match payload.kind {
                        SubKind::Subscribe => {
                            let subscription_id = SubscriptionId::new(payload.label);

                            match payload.event_id {
                                Some(id) => {
                                    let event_id = EventId::from_str(&id).unwrap();
                                    let filter =
                                        Filter::new().event(event_id).since(Timestamp::now());

                                    if let Err(e) = client
                                        .subscribe_with_id(subscription_id, vec![filter], None)
                                        .await
                                    {
                                        println!("Subscription error: {}", e)
                                    }
                                }
                                None => {
                                    let contact_list = state.contact_list.lock().await;
                                    if !contact_list.is_empty() {
                                        let authors: Vec<PublicKey> =
                                            contact_list.iter().map(|f| f.public_key).collect();

                                        let filter = Filter::new()
                                            .kinds(vec![Kind::TextNote, Kind::Repost])
                                            .authors(authors)
                                            .since(Timestamp::now());

                                        if let Err(e) = client
                                            .subscribe_with_id(subscription_id, vec![filter], None)
                                            .await
                                        {
                                            println!("Subscription error: {}", e)
                                        }
                                    }
                                }
                            };
                        }
                        SubKind::Unsubscribe => {
                            let subscription_id = SubscriptionId::new(payload.label);
                            client.unsubscribe(subscription_id).await
                        }
                    }
                });
            });

            // Run local relay thread
            tauri::async_runtime::spawn(async move {
                let database = NostrLMDB::open(data_dir.join("local-relay"))
                    .expect("Error: cannot create database.");
                let builder = RelayBuilder::default().database(database).port(1984);

                if let Ok(relay) = LocalRelay::run(builder).await {
                    println!("Running local relay: {}", relay.url())
                }

                loop {
                    tokio::time::sleep(Duration::from_secs(60)).await;
                }
            });

            // Run notification thread
            tauri::async_runtime::spawn(async move {
                let state = handle_clone.state::<Nostr>();
                let client = &state.client;

                let allow_notification = match handle_clone.notification().request_permission() {
                    Ok(_) => {
                        if let Ok(perm) = handle_clone.notification().permission_state() {
                            PermissionState::Granted == perm
                        } else {
                            false
                        }
                    }
                    Err(_) => false,
                };

                let notification_id = SubscriptionId::new(NOTIFICATION_SUB_ID);
                let mut notifications = client.pool().notifications();

                while let Ok(notification) = notifications.recv().await {
                    match notification {
                        RelayPoolNotification::Message { relay_url, message } => {
                            if let RelayMessage::Auth { challenge } = message {
                                match client.auth(challenge, relay_url.clone()).await {
                                    Ok(..) => {
                                        if let Ok(relay) = client.relay(&relay_url).await {
                                            let msg =
                                                format!("Authenticated to {} relay.", relay_url);
                                            let opts = RelaySendOptions::new()
                                                .skip_send_confirmation(true);

                                            if let Err(e) = relay.resubscribe(opts).await {
                                                println!("Error: {}", e);
                                            }

                                            if allow_notification {
                                                if let Err(e) = &handle_clone
                                                    .notification()
                                                    .builder()
                                                    .body(&msg)
                                                    .title("Lume")
                                                    .show()
                                                {
                                                    println!("Error: {}", e);
                                                }
                                            }
                                        }
                                    }
                                    Err(e) => {
                                        if allow_notification {
                                            if let Err(e) = &handle_clone
                                                .notification()
                                                .builder()
                                                .body(e.to_string())
                                                .title("Lume")
                                                .show()
                                            {
                                                println!("Error: {}", e);
                                            }
                                        }
                                    }
                                }
                            } else if let RelayMessage::Event {
                                subscription_id,
                                event,
                            } = message
                            {
                                // Handle events from notification subscription
                                if subscription_id == notification_id {
                                    // Send native notification
                                    if allow_notification {
                                        let author = client
                                            .fetch_metadata(
                                                event.pubkey,
                                                Some(Duration::from_secs(3)),
                                            )
                                            .await
                                            .unwrap_or_else(|_| Metadata::new());

                                        send_event_notification(&event, author, &handle_clone);
                                    }
                                }

                                let label = subscription_id.to_string();
                                let raw = event.as_json();
                                let parsed = if event.kind == Kind::TextNote {
                                    Some(parse_event(&event.content).await)
                                } else {
                                    None
                                };

                                handle_clone
                                    .emit_to(
                                        EventTarget::labeled(label),
                                        "event",
                                        RichEvent { raw, parsed },
                                    )
                                    .unwrap();
                            };
                        }
                        RelayPoolNotification::Shutdown => break,
                        _ => (),
                    }
                }
            });

            Ok(())
        })
        .plugin(prevent_default())
        .plugin(tauri_plugin_decorum::init())
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
        .run(tauri::generate_context!())
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

fn send_event_notification(event: &Event, author: Metadata, handle: &tauri::AppHandle) {
    match event.kind {
        Kind::TextNote => {
            if let Err(e) = handle
                .notification()
                .builder()
                .body("Mentioned you in a thread.")
                .title(author.display_name.unwrap_or_else(|| "Lume".to_string()))
                .show()
            {
                println!("Error: {}", e);
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
                println!("Error: {}", e);
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
                println!("Error: {}", e);
            }
        }
        _ => {}
    }
}
