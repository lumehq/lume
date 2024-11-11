#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
use border::WebviewWindowExt as BorderWebviewWindowExt;
use commands::{account::*, event::*, metadata::*, relay::*, sync::*, window::*};
use common::{get_all_accounts, parse_event};
use nostr_sdk::prelude::{Profile as DatabaseProfile, *};
use serde::{Deserialize, Serialize};
use specta::Type;
use specta_typescript::Typescript;
use std::{collections::HashSet, fs, str::FromStr, time::Duration};
use tauri::{
    menu::{Menu, MenuItem},
    Emitter, EventTarget, Listener, Manager, WebviewWindowBuilder,
};
use tauri_plugin_decorum::WebviewWindowExt;
use tauri_plugin_notification::{NotificationExt, PermissionState};
use tauri_plugin_store::StoreExt;
use tauri_specta::{collect_commands, Builder};
use tokio::{sync::RwLock, time::sleep};

pub mod commands;
pub mod common;

pub struct Nostr {
    client: Client,
    queue: RwLock<HashSet<PublicKey>>,
    settings: RwLock<Settings>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Payload {
    id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct Settings {
    resize_service: bool,
    content_warning: bool,
    display_avatar: bool,
    display_zap_button: bool,
    display_repost_button: bool,
    display_media: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            content_warning: true,
            resize_service: true,
            display_avatar: true,
            display_zap_button: true,
            display_repost_button: true,
            display_media: true,
        }
    }
}

pub const DEFAULT_DIFFICULTY: u8 = 0;
pub const FETCH_LIMIT: usize = 50;
pub const QUEUE_DELAY: u64 = 150;
pub const NOTIFICATION_SUB_ID: &str = "lume_notification";
// Will be removed when almost relays support negentropy
pub const BOOTSTRAP_RELAYS: [&str; 5] = [
    "wss://relay.damus.io",
    "wss://relay.primal.net",
    "wss://nostr.fmt.wiz.biz",
    "wss://directory.yabu.me",
    "wss://purplepag.es",
];

fn main() {
    tracing_subscriber::fmt::init();

    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![
        sync_all,
        get_all_relays,
        get_all_relay_lists,
        is_relay_connected,
        connect_relay,
        remove_relay,
        get_accounts,
        watch_account,
        import_account,
        connect_account,
        get_private_key,
        delete_account,
        reset_password,
        has_signer,
        set_signer,
        get_profile,
        set_profile,
        get_contact_list,
        set_contact_list,
        is_contact,
        toggle_contact,
        get_all_profiles,
        set_group,
        get_group,
        get_all_newsfeeds,
        get_all_local_newsfeeds,
        set_interest,
        get_interest,
        get_all_interests,
        get_all_local_interests,
        get_relay_list,
        set_wallet,
        load_wallet,
        remove_wallet,
        zap_profile,
        zap_event,
        copy_friend,
        get_notifications,
        verify_nip05,
        get_meta_from_event,
        get_event,
        get_replies,
        get_all_events_by_author,
        get_all_events_by_authors,
        get_all_events_by_hashtags,
        get_all_events_from,
        get_all_events_by_kind,
        get_all_providers,
        request_events_from_provider,
        get_all_events_by_request,
        get_local_events,
        get_global_events,
        search,
        publish,
        reply,
        repost,
        is_reposted,
        request_delete,
        is_deleted_event,
        event_to_bech32,
        user_to_bech32,
        create_column,
        reload_column,
        close_column,
        close_all_columns,
        open_window,
        get_app_settings,
        set_app_settings,
    ]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/commands.gen.ts")
        .expect("Failed to export typescript bindings");

    let tauri_builder = tauri::Builder::default();
    let mut ctx = tauri::generate_context!();

    tauri_builder
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            let handle = app.handle();
            let handle_clone = handle.clone();
            let handle_clone_child = handle_clone.clone();
            let handle_clone_event = handle_clone_child.clone();
            let main_window = app.get_webview_window("main").unwrap();

            let config_dir = handle
                .path()
                .app_config_dir()
                .expect("Error: app config directory not found.");

            let _ = fs::create_dir_all(&config_dir);

            // Set custom decoration for Windows
            #[cfg(target_os = "windows")]
            main_window.create_overlay_titlebar().unwrap();

            // Restore native border
            #[cfg(target_os = "macos")]
            main_window.add_border(None);

            // Set a custom inset to the traffic lights
            #[cfg(target_os = "macos")]
            main_window.set_traffic_lights_inset(7.0, 10.0).unwrap();

            // Setup tray menu item
            let open_i = MenuItem::with_id(app, "open", "Open Lume", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            // Create tray menu
            let menu = Menu::with_items(app, &[&open_i, &quit_i])?;
            // Get main tray
            let tray = app.tray_by_id("main").unwrap();
            // Set menu
            tray.set_menu(Some(menu)).unwrap();
            // Listen to tray events
            tray.on_menu_event(|handle, event| match event.id().as_ref() {
                "open" => {
                    if let Some(window) = handle.get_window("main") {
                        if window.is_visible().unwrap_or_default() {
                            let _ = window.set_focus();
                        } else {
                            let _ = window.show();
                            let _ = window.set_focus();
                        };
                    } else {
                        let window = WebviewWindowBuilder::from_config(
                            handle,
                            handle.config().app.windows.first().unwrap(),
                        )
                        .unwrap()
                        .build()
                        .unwrap();

                        // Set decoration
                        #[cfg(target_os = "windows")]
                        window.create_overlay_titlebar().unwrap();

                        // Restore native border
                        #[cfg(target_os = "macos")]
                        window.add_border(None);

                        // Set a custom inset to the traffic lights
                        #[cfg(target_os = "macos")]
                        window.set_traffic_lights_inset(7.0, 10.0).unwrap();
                    }
                }
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            });

            let client = tauri::async_runtime::block_on(async move {
                // Setup database
                let database = NostrLMDB::open(config_dir.join("nostr"))
                    .expect("Error: cannot create database.");

                // Config
                let opts = Options::new()
                    .gossip(true)
                    .max_avg_latency(Duration::from_secs(2))
                    .timeout(Duration::from_secs(10));

                // Setup nostr client
                let client = ClientBuilder::default()
                    .database(database)
                    .opts(opts)
                    .build();

                /* Get bootstrap relays
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
                */

                for relay in BOOTSTRAP_RELAYS {
                    let _ = client.add_relay(relay).await;
                }

                let _ = client.add_discovery_relay("wss://user.kindpag.es/").await;

                // Connect
                client.connect().await;

                client
            });

            // Load app settings
            let store = app.store(".data")?;

            // Parse app settings if exist
            let settings = if let Some(data) = store.get("tanstack-query-[\"settings\"]") {
                if let Some(str) = data.as_str() {
                    let v: Value = serde_json::from_str(str).unwrap();
                    let data = v["state"]["data"].clone();
                    let parse: Settings = serde_json::from_value(data).unwrap();

                    RwLock::new(parse)
                } else {
                    RwLock::new(Settings::default())
                }
            } else {
                RwLock::new(Settings::default())
            };

            // Create global state
            app.manage(Nostr {
                client,
                settings,
                queue: RwLock::new(HashSet::new()),
            });

            // Listen for request metadata
            app.listen_any("request_metadata", move |event| {
                let payload = event.payload();
                let parsed_payload: Payload = serde_json::from_str(payload).expect("Parse failed");
                let handle = handle_clone_child.clone();

                tauri::async_runtime::spawn(async move {
                    let state = handle.state::<Nostr>();
                    let client = &state.client;

                    if let Ok(public_key) = PublicKey::parse(parsed_payload.id) {
                        let mut write_queue = state.queue.write().await;
                        write_queue.insert(public_key);
                    };

                    // Wait for [QUEUE_DELAY]
                    sleep(Duration::from_millis(QUEUE_DELAY)).await;

                    let read_queue = state.queue.read().await;

                    if !read_queue.is_empty() {
                        let authors: HashSet<PublicKey> = read_queue.iter().copied().collect();

                        let filter = Filter::new()
                            .authors(authors)
                            .kind(Kind::Metadata)
                            .limit(200);

                        let opts = SubscribeAutoCloseOptions::default()
                            .filter(FilterOptions::WaitDurationAfterEOSE(Duration::from_secs(2)));

                        // Drop queue, you don't need it at this time anymore
                        drop(read_queue);
                        // Clear queue
                        let mut write_queue = state.queue.write().await;
                        write_queue.clear();

                        if let Err(e) = client.subscribe(vec![filter], Some(opts)).await {
                            println!("Subscribe error: {}", e);
                        }
                    }
                });
            });

            // Run a thread for negentropy
            tauri::async_runtime::spawn(async move {
                let state = handle_clone_event.state::<Nostr>();
                let client = &state.client;

                // Use default sync options
                let opts = SyncOptions::default();

                // Set interval
                let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(600));
                // Skip the first tick
                interval.tick().await;

                loop {
                    interval.tick().await;

                    let accounts = get_all_accounts();
                    let public_keys: Vec<PublicKey> = accounts
                        .iter()
                        .filter_map(|acc| PublicKey::from_str(acc).ok())
                        .collect();

                    if !public_keys.is_empty() {
                        // Create filter for notification
                        //
                        let filter = Filter::new().pubkeys(public_keys.clone()).kinds(vec![
                            Kind::TextNote,
                            Kind::Repost,
                            Kind::Reaction,
                            Kind::ZapReceipt,
                        ]);

                        // Sync notification
                        //
                        if let Ok(output) = client.sync_with(BOOTSTRAP_RELAYS, filter, &opts).await
                        {
                            println!("Received: {}", output.received.len())
                        }

                        // Create filter for contact list
                        //
                        let filter = Filter::new()
                            .authors(public_keys)
                            .kinds(vec![Kind::ContactList, Kind::FollowSet]);

                        // Sync events for contact list
                        //
                        if let Ok(events) = client.database().query(vec![filter]).await {
                            // Get unique public keys
                            let public_keys: HashSet<PublicKey> = events
                                .iter()
                                .flat_map(|ev| ev.tags.public_keys().copied())
                                .collect();

                            // Convert to vector
                            let public_keys: Vec<PublicKey> = public_keys.into_iter().collect();

                            for chunk in public_keys.chunks(1000) {
                                if chunk.is_empty() {
                                    return;
                                }

                                let authors = chunk.to_owned();

                                // Create filter for metadata
                                //
                                let filter = Filter::new().authors(authors.clone()).kinds(vec![
                                    Kind::Metadata,
                                    Kind::FollowSet,
                                    Kind::Interests,
                                    Kind::InterestSet,
                                ]);

                                // Sync metadata
                                //
                                if let Ok(output) =
                                    client.sync_with(BOOTSTRAP_RELAYS, filter, &opts).await
                                {
                                    println!("Received: {}", output.received.len())
                                }

                                // Create filter for text note
                                //
                                let filter = Filter::new()
                                    .authors(authors)
                                    .kinds(vec![Kind::TextNote, Kind::Repost, Kind::EventDeletion])
                                    .limit(100);

                                // Sync text note
                                //
                                if let Ok(output) =
                                    client.sync_with(BOOTSTRAP_RELAYS, filter, &opts).await
                                {
                                    println!("Received: {}", output.received.len())
                                }
                            }
                        }
                    }
                }
            });

            // Run a thread for handle notification
            tauri::async_runtime::spawn(async move {
                let state = handle_clone.state::<Nostr>();
                let client = &state.client;
                let accounts = get_all_accounts();

                if !accounts.is_empty() {
                    let subscription_id = SubscriptionId::new(NOTIFICATION_SUB_ID);

                    let public_keys: Vec<PublicKey> = accounts
                        .iter()
                        .filter_map(|acc| PublicKey::from_str(acc).ok())
                        .collect();

                    let filter = Filter::new()
                        .pubkeys(public_keys)
                        .kinds(vec![
                            Kind::TextNote,
                            Kind::Repost,
                            Kind::Reaction,
                            Kind::ZapReceipt,
                            Kind::Comment,
                        ])
                        .since(Timestamp::now());

                    // Subscribe for new notification
                    if let Err(e) = client
                        .subscribe_with_id(subscription_id, vec![filter], None)
                        .await
                    {
                        println!("Subscribe error: {}", e)
                    }
                }

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

                let _ = client
                    .handle_notifications(|notification| async {
                        #[allow(clippy::collapsible_match)]
                        if let RelayPoolNotification::Message { message, .. } = notification {
                            if let RelayMessage::Event {
                                event,
                                subscription_id,
                                ..
                            } = message
                            {
                                if subscription_id == notification_id {
                                    // Send native notification
                                    if allow_notification {
                                        let author = client
                                            .database()
                                            .profile(event.pubkey)
                                            .await
                                            .unwrap_or_else(|_| {
                                                DatabaseProfile::new(event.pubkey, Metadata::new())
                                            });

                                        send_event_notification(
                                            &event,
                                            author.metadata(),
                                            &handle_clone,
                                        );
                                    }
                                } else if event.kind == Kind::Metadata {
                                    if let Err(e) = handle_clone.emit("metadata", event.as_json()) {
                                        println!("Emit error: {}", e)
                                    }
                                } else if event.kind == Kind::Comment {
                                    let payload = RichEvent {
                                        raw: event.as_json(),
                                        parsed: if event.kind == Kind::TextNote {
                                            Some(parse_event(&event.content).await)
                                        } else {
                                            None
                                        },
                                    };

                                    if let Err(e) = handle_clone.emit_to(
                                        EventTarget::labeled(subscription_id.to_string()),
                                        "comment",
                                        payload,
                                    ) {
                                        println!("Emit error: {}", e)
                                    }
                                }
                            }
                        }
                        Ok(false)
                    })
                    .await;
            });

            Ok(())
        })
        .plugin(prevent_default())
        .plugin(tauri_plugin_theme::init(ctx.config_mut()))
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
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .build(ctx)
        .expect("error while running tauri application")
        .run(|_app_handle, event| {
            if let tauri::RunEvent::ExitRequested { api, .. } = event {
                api.prevent_exit();
            }
        });
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
                .body("You're mentioned in a thread.")
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
                .body("Your note has been reposted.")
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
                .body("You've received zap.")
                .title(author.display_name.unwrap_or_else(|| "Lume".to_string()))
                .show()
            {
                println!("Error: {}", e);
            }
        }
        _ => {}
    }
}
