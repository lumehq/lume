use std::path::PathBuf;

#[cfg(target_os = "macos")]
use border::WebviewWindowExt as BorderWebviewWindowExt;
use serde::{Deserialize, Serialize};
use specta::Type;
use tauri::utils::config::WindowEffectsConfig;
use tauri::webview::PageLoadEvent;
use tauri::window::Effect;
#[cfg(target_os = "macos")]
use tauri::TitleBarStyle;
use tauri::{LogicalPosition, LogicalSize, Manager, WebviewUrl, Window};
use tauri::{WebviewBuilder, WebviewWindowBuilder};
#[cfg(target_os = "windows")]
use tauri_plugin_decorum::WebviewWindowExt;

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
        Some(_) => Ok(column.label),
        None => {
            let path = PathBuf::from(column.url);
            let webview_url = WebviewUrl::App(path);

            let builder = WebviewBuilder::new(column.label, webview_url)
                .incognito(true)
                .transparent(true)
                .on_page_load(|webview, payload| match payload.event() {
                    PageLoadEvent::Started => {
                        let url = payload.url();
                        println!("#TODO, preload: {}", url)
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
        None => Err("Cannot close, column not found.".into()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn update_column(
    label: String,
    width: f32,
    height: f32,
    x: f32,
    y: f32,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    match app_handle.get_webview(&label) {
        Some(webview) => {
            if let Err(e) = webview.set_size(LogicalSize::new(width, height)) {
                return Err(e.to_string());
            }

            if let Err(e) = webview.set_position(LogicalPosition::new(x, y)) {
                return Err(e.to_string());
            }

            Ok(())
        }
        None => Err("Cannot update, column not found.".into()),
    }
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
        .effects(WindowEffectsConfig {
            state: None,
            effects: vec![Effect::Mica],
            radius: None,
            color: None,
        })
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
