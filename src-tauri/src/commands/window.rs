#[cfg(target_os = "macos")]
use border::WebviewWindowExt as BorderWebviewWindowExt;
use nostr_sdk::prelude::*;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::path::PathBuf;
#[cfg(target_os = "macos")]
use tauri::TitleBarStyle;
use tauri::{
    utils::config::WindowEffectsConfig, webview::PageLoadEvent, window::Effect, LogicalPosition,
    LogicalSize, Manager, WebviewBuilder, WebviewUrl, WebviewWindowBuilder, Window,
};
#[cfg(target_os = "windows")]
use tauri_plugin_decorum::WebviewWindowExt;

use crate::common::get_last_segment;
use crate::Nostr;

#[derive(Serialize, Deserialize, Type)]
pub struct NewWindow {
    label: String,
    title: String,
    url: String,
    width: f64,
    height: f64,
    maximizable: bool,
    minimizable: bool,
    hidden_title: bool,
    closable: bool,
}

#[derive(Serialize, Deserialize, Type)]
pub struct Column {
    label: String,
    url: String,
    x: f32,
    y: f32,
    width: f32,
    height: f32,
}

#[tauri::command]
#[specta::specta]
pub async fn create_column(
    column: Column,
    app_handle: tauri::AppHandle,
    main_window: Window,
) -> Result<String, String> {
    match app_handle.get_webview(&column.label) {
        Some(webview) => {
            if let Err(e) = webview.set_size(LogicalSize::new(column.width, column.height)) {
                return Err(e.to_string());
            }

            if let Err(e) = webview.set_position(LogicalPosition::new(column.x, column.y)) {
                return Err(e.to_string());
            }

            Ok(column.label)
        }
        None => {
            let path = PathBuf::from(column.url);
            let webview_url = WebviewUrl::App(path);

            let builder = WebviewBuilder::new(column.label, webview_url)
                .incognito(true)
                .transparent(true)
                .on_page_load(|webview, payload| match payload.event() {
                    PageLoadEvent::Started => {
                        if let Ok(id) = get_last_segment(payload.url()) {
                            if let Ok(public_key) = PublicKey::parse(&id) {
                                let is_newsfeed = payload.url().to_string().contains("newsfeed");

                                tauri::async_runtime::spawn(async move {
                                    let state = webview.state::<Nostr>();
                                    let client = &state.client;

                                    if is_newsfeed {
                                        if let Ok(contact_list) =
                                            client.database().contacts_public_keys(public_key).await
                                        {
                                            let subscription_id =
                                                SubscriptionId::new(webview.label());

                                            let filter = Filter::new()
                                                .authors(contact_list)
                                                .kinds(vec![
                                                    Kind::TextNote,
                                                    Kind::Repost,
                                                    Kind::EventDeletion,
                                                ])
                                                .since(Timestamp::now());

                                            if let Err(e) = client
                                                .subscribe_with_id(
                                                    subscription_id,
                                                    vec![filter],
                                                    None,
                                                )
                                                .await
                                            {
                                                println!("Subscription error: {}", e);
                                            }
                                        }
                                    }
                                });
                            } else if let Ok(event_id) = EventId::parse(&id) {
                                tauri::async_runtime::spawn(async move {
                                    let state = webview.state::<Nostr>();
                                    let client = &state.client;

                                    let subscription_id = SubscriptionId::new(webview.label());

                                    let filter = Filter::new()
                                        .event(event_id)
                                        .kinds(vec![Kind::TextNote, Kind::Custom(1111)])
                                        .since(Timestamp::now());

                                    if let Err(e) = client
                                        .subscribe_with_id(subscription_id, vec![filter], None)
                                        .await
                                    {
                                        println!("Subscription error: {}", e);
                                    }
                                });
                            }
                        }
                    }
                    PageLoadEvent::Finished => {
                        println!("{} finished loading", payload.url());
                    }
                });

            match main_window.add_child(
                builder,
                LogicalPosition::new(column.x, column.y),
                LogicalSize::new(column.width, column.height),
            ) {
                Ok(webview) => Ok(webview.label().into()),
                Err(e) => Err(e.to_string()),
            }
        }
    }
}

#[tauri::command]
#[specta::specta]
pub async fn close_column(label: String, app_handle: tauri::AppHandle) -> Result<bool, String> {
    match app_handle.get_webview(&label) {
        Some(webview) => Ok(webview.close().is_ok()),
        None => Err(format!("Cannot close, column not found: {}", label)),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn close_all_columns(app_handle: tauri::AppHandle) -> Result<(), String> {
    let mut webviews = app_handle.webviews();
    webviews.remove("main");

    for webview in webviews.values() {
        webview.close().unwrap()
    }

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn reload_column(label: String, app_handle: tauri::AppHandle) -> Result<(), String> {
    match app_handle.get_webview(&label) {
        Some(webview) => {
            webview.eval("location.reload(true)").unwrap();
            Ok(())
        }
        None => Err("Cannot reload, column not found.".into()),
    }
}

#[tauri::command]
#[specta::specta]
pub fn open_window(window: NewWindow, app_handle: tauri::AppHandle) -> Result<String, String> {
    if let Some(current_window) = app_handle.get_window(&window.label) {
        if current_window.is_visible().unwrap_or_default() {
            let _ = current_window.set_focus();
        } else {
            let _ = current_window.show();
            let _ = current_window.set_focus();
        };

        Ok(current_window.label().to_string())
    } else {
        #[cfg(target_os = "macos")]
        let new_window = WebviewWindowBuilder::new(
            &app_handle,
            &window.label,
            WebviewUrl::App(PathBuf::from(window.url)),
        )
        .title(&window.title)
        .min_inner_size(window.width, window.height)
        .inner_size(window.width, window.height)
        .hidden_title(window.hidden_title)
        .title_bar_style(TitleBarStyle::Overlay)
        .minimizable(window.minimizable)
        .maximizable(window.maximizable)
        .transparent(true)
        .closable(window.closable)
        .effects(WindowEffectsConfig {
            state: None,
            effects: vec![Effect::UnderWindowBackground],
            radius: None,
            color: None,
        })
        .build()
        .unwrap();

        #[cfg(target_os = "windows")]
        let new_window = WebviewWindowBuilder::new(
            &app_handle,
            &window.label,
            WebviewUrl::App(PathBuf::from(window.url)),
        )
        .title(&window.title)
        .min_inner_size(window.width, window.height)
        .inner_size(window.width, window.height)
        .minimizable(window.minimizable)
        .maximizable(window.maximizable)
        .transparent(true)
        .decorations(false)
        .closable(window.closable)
        .build()
        .unwrap();

        // Set decoration
        #[cfg(target_os = "windows")]
        new_window.create_overlay_titlebar().unwrap();

        // Restore native border
        #[cfg(target_os = "macos")]
        new_window.add_border(None);

        Ok(new_window.label().to_string())
    }
}
