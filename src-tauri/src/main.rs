#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
use border::WebviewWindowExt as BorderWebviewWindowExt;
use commands::{account::*, event::*, metadata::*, relay::*, sync::NegentropyEvent, window::*};
use common::{get_all_accounts, parse_event};
use nostr_sdk::prelude::{Profile as DatabaseProfile, *};
use serde::{Deserialize, Serialize};
use specta::Type;
use specta_typescript::Typescript;
use std::{
    collections::HashSet,
    fs,
    io::{self, BufRead},
    str::FromStr,
    sync::Mutex,
    time::Duration,
};
use tauri::{path::BaseDirectory, Emitter, EventTarget, Manager, WindowEvent};
use tauri_plugin_decorum::WebviewWindowExt;
use tauri_plugin_notification::{NotificationExt, PermissionState};
use tauri_specta::{collect_commands, collect_events, Builder, Event as TauriEvent};

pub mod commands;
pub mod common;

pub struct Nostr {
    client: Client,
    settings: Mutex<Settings>,
    accounts: Mutex<Vec<String>>,
    bootstrap_relays: Mutex<Vec<Url>>,
    subscriptions: Mutex<HashSet<SubscriptionId>>,
    send_queue: Mutex<HashSet<Event>>,
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
            trusted_only: false,
            display_avatar: true,
            display_zap_button: true,
            display_repost_button: true,
            display_media: true,
            transparent: true,
        }
    }
}

#[derive(Serialize, Deserialize, Type)]
enum SubscriptionMethod {
    Subscribe,
    Unsubscribe,
}

#[derive(Serialize, Deserialize, Type, TauriEvent)]
struct Subscription {
    label: String,
    kind: SubscriptionMethod,
    event_id: Option<String>,
    contacts: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize, Type, TauriEvent)]
struct Sync {
    id: String,
}

pub const DEFAULT_DIFFICULTY: u8 = 21;
pub const FETCH_LIMIT: usize = 50;
pub const NOTIFICATION_SUB_ID: &str = "lume_notification";

fn main() {
    let builder = Builder::<tauri::Wry>::new()
        .commands(collect_commands![
            get_relays,
            connect_relay,
            remove_relay,
            get_bootstrap_relays,
            save_bootstrap_relays,
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
            get_all_groups,
            set_interest,
            get_interest,
            get_all_interests,
            set_wallet,
            load_wallet,
            remove_wallet,
            zap_profile,
            zap_event,
            copy_friend,
            get_notifications,
            get_user_settings,
            set_user_settings,
            verify_nip05,
            get_event_meta,
            get_event,
            get_event_from,
            get_replies,
            subscribe_to,
            get_all_events_by_author,
            get_all_events_by_authors,
            get_all_events_by_hashtags,
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
            update_column,
            reload_column,
            close_column,
            open_window,
            reopen_lume,
            quit
        ])
        .events(collect_events![Subscription, NegentropyEvent]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/commands.gen.ts")
        .expect("Failed to export typescript bindings");

    let tauri_builder = tauri::Builder::default();
    let mut ctx = tauri::generate_context!();

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

            let (client, bootstrap_relays) = tauri::async_runtime::block_on(async move {
                // Setup database
                let database = NostrLMDB::open(config_dir.join("nostr"))
                    .expect("Error: cannot create database.");

                // Config
                let opts = Options::new()
                    .gossip(true)
                    .max_avg_latency(Duration::from_millis(800))
                    .automatic_authentication(false)
                    .connection_timeout(Some(Duration::from_secs(20)))
                    .send_timeout(Some(Duration::from_secs(10)))
                    .wait_for_send(false)
                    .timeout(Duration::from_secs(20));

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

                let _ = client.add_discovery_relay("wss://purplepag.es/").await;
                let _ = client.add_discovery_relay("wss://directory.yabu.me/").await;
                let _ = client.add_discovery_relay("wss://user.kindpag.es/").await;

                // Connect
                client.connect_with_timeout(Duration::from_secs(10)).await;

                // Get all bootstrap relays
                let bootstrap_relays: Vec<Url> =
                    client.pool().all_relays().await.into_keys().collect();

                (client, bootstrap_relays)
            });

            let accounts = get_all_accounts();

            // Create global state
            app.manage(Nostr {
                client,
                accounts: Mutex::new(accounts),
                settings: Mutex::new(Settings::default()),
                bootstrap_relays: Mutex::new(bootstrap_relays),
                subscriptions: Mutex::new(HashSet::new()),
                send_queue: Mutex::new(HashSet::new()),
            });

            // Handle subscription request
            Subscription::listen_any(app, move |event| {
                let handle = handle_clone_child.to_owned();
                let payload = event.payload;

                tauri::async_runtime::spawn(async move {
                    let state = handle.state::<Nostr>();
                    let client = &state.client;

                    match payload.kind {
                        SubscriptionMethod::Subscribe => {
                            let subscription_id = SubscriptionId::new(payload.label);

                            if !client
                                .pool()
                                .subscriptions()
                                .await
                                .contains_key(&subscription_id)
                            {
                                // Update state
                                state
                                    .subscriptions
                                    .lock()
                                    .unwrap()
                                    .insert(subscription_id.clone());

                                println!(
                                    "Total subscriptions: {}",
                                    state.subscriptions.lock().unwrap().len()
                                );

                                if let Some(id) = payload.event_id {
                                    let event_id = EventId::from_str(&id).unwrap();
                                    let filter =
                                        Filter::new().event(event_id).since(Timestamp::now());

                                    if let Err(e) = client
                                        .subscribe_with_id(
                                            subscription_id.clone(),
                                            vec![filter],
                                            None,
                                        )
                                        .await
                                    {
                                        println!("Subscription error: {}", e)
                                    }
                                }

                                if let Some(ids) = payload.contacts {
                                    let authors: Vec<PublicKey> = ids
                                        .iter()
                                        .filter_map(|item| {
                                            if let Ok(pk) = PublicKey::from_str(item) {
                                                Some(pk)
                                            } else {
                                                None
                                            }
                                        })
                                        .collect();

                                    if let Err(e) = client
                                        .subscribe_with_id(
                                            subscription_id,
                                            vec![Filter::new()
                                                .kinds(vec![Kind::TextNote, Kind::Repost])
                                                .authors(authors)
                                                .since(Timestamp::now())],
                                            None,
                                        )
                                        .await
                                    {
                                        println!("Subscription error: {}", e)
                                    }
                                }
                            }
                        }
                        SubscriptionMethod::Unsubscribe => {
                            let subscription_id = SubscriptionId::new(payload.label);

                            println!(
                                "Total subscriptions: {}",
                                state.subscriptions.lock().unwrap().len()
                            );

                            state.subscriptions.lock().unwrap().remove(&subscription_id);
                            client.unsubscribe(subscription_id).await;
                        }
                    }
                });
            });

            // Run notification thread
            tauri::async_runtime::spawn(async move {
                let state = handle_clone.state::<Nostr>();
                let client = &state.client;
                let accounts = state.accounts.lock().unwrap().clone();

                let public_keys: Vec<PublicKey> = accounts
                    .iter()
                    .filter_map(|acc| {
                        if let Ok(pk) = PublicKey::from_str(acc) {
                            Some(pk)
                        } else {
                            None
                        }
                    })
                    .collect();

                // Subscribe for new notification
                if let Ok(e) = client
                    .subscribe_with_id(
                        SubscriptionId::new(NOTIFICATION_SUB_ID),
                        vec![Filter::new().pubkeys(public_keys).since(Timestamp::now())],
                        None,
                    )
                    .await
                {
                    println!("Subscribed for notification on {} relays", e.success.len())
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
                let mut notifications = client.pool().notifications();
                let mut new_events: Vec<EventId> = Vec::new();

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

                                            // Workaround for https://github.com/rust-nostr/nostr/issues/509
                                            // TODO: remove
                                            let _ = client
                                                .fetch_events(
                                                    vec![Filter::new()
                                                        .kind(Kind::TextNote)
                                                        .limit(0)],
                                                    Some(Duration::from_secs(5)),
                                                )
                                                .await;

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
                                let tags: Vec<String> = event
                                    .tags
                                    .public_keys()
                                    .filter_map(|pk| {
                                        if let Ok(bech32) = pk.to_bech32() {
                                            Some(bech32)
                                        } else {
                                            None
                                        }
                                    })
                                    .collect();

                                // Handle events from notification subscription
                                if subscription_id == notification_id
                                    && tags.iter().any(|item| accounts.iter().any(|i| i == item))
                                {
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
                                }

                                let payload = RichEvent {
                                    raw: event.as_json(),
                                    parsed: if event.kind == Kind::TextNote {
                                        Some(parse_event(&event.content).await)
                                    } else {
                                        None
                                    },
                                };

                                handle_clone
                                    .emit_to(
                                        EventTarget::labeled(subscription_id.to_string()),
                                        "event",
                                        payload,
                                    )
                                    .unwrap();

                                if state
                                    .subscriptions
                                    .lock()
                                    .unwrap()
                                    .iter()
                                    .any(|i| i == &subscription_id)
                                {
                                    new_events.push(event.id);

                                    if new_events.len() > 5 {
                                        handle_clone.emit("synchronized", ()).unwrap();
                                        new_events.clear();
                                    }
                                }
                            };
                        }
                        RelayPoolNotification::Shutdown => break,
                        _ => (),
                    }
                }
            });

            Ok(())
        })
        .on_window_event(|window, event| match event {
            WindowEvent::CloseRequested { api, .. } => {
                api.prevent_close();
                // Just hide window not close
                window.hide().unwrap();

                let state = window.state::<Nostr>();
                let client = &state.client;
                let queue: Vec<Event> = state
                    .send_queue
                    .lock()
                    .unwrap()
                    .clone()
                    .into_iter()
                    .collect();

                if !queue.is_empty() {
                    tauri::async_runtime::block_on(async {
                        println!("Sending total {} events to relays", queue.len());
                        match client.batch_event(queue, RelaySendOptions::default()).await {
                            Ok(_) => window.destroy().unwrap(),
                            Err(_) => window.emit("batch-event", ()).unwrap(),
                        }
                    });
                } else {
                    window.destroy().unwrap()
                }
            }
            WindowEvent::Focused(_focused) => {
                // TODO
            }
            _ => {}
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
