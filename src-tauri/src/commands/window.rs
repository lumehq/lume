use std::path::PathBuf;

#[cfg(target_os = "macos")]
use border::WebviewWindowExt as BorderWebviewWindowExt;
use serde::{Deserialize, Serialize};
use specta::Type;
use tauri::utils::config::WindowEffectsConfig;
use tauri::window::Effect;
#[cfg(target_os = "macos")]
use tauri::TitleBarStyle;
use tauri::{LogicalPosition, LogicalSize, Manager, WebviewUrl};
use tauri::{WebviewBuilder, WebviewWindowBuilder};
use tauri_plugin_decorum::WebviewWindowExt;

#[derive(Serialize, Deserialize, Type)]
pub struct Window {
    label: String,
    title: String,
    url: String,
    width: f64,
    height: f64,
    maximizable: bool,
    minimizable: bool,
    hidden_title: bool,
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

#[tauri::command(async)]
#[specta::specta]
pub fn create_column(column: Column, app_handle: tauri::AppHandle) -> Result<String, String> {
    match app_handle.get_window("main") {
        Some(main_window) => match app_handle.get_webview(&column.label) {
            Some(_) => Ok(column.label),
            None => {
                let path = PathBuf::from(column.url);
                let webview_url = WebviewUrl::App(path);

                let builder = WebviewBuilder::new(column.label, webview_url)
                    .incognito(true)
                    .transparent(true);

                if let Ok(webview) = main_window.add_child(
                    builder,
                    LogicalPosition::new(column.x, column.y),
                    LogicalSize::new(column.width, column.height),
                ) {
                    Ok(webview.label().into())
                } else {
                    Err("Create webview failed".into())
                }
            }
        },
        None => Err("Main window not found".into()),
    }
}

#[tauri::command(async)]
#[specta::specta]
pub fn close_column(label: String, app_handle: tauri::AppHandle) -> Result<bool, String> {
    match app_handle.get_webview(&label) {
        Some(webview) => Ok(webview.close().is_ok()),
        None => Err("Not found.".into()),
    }
}

#[tauri::command(async)]
#[specta::specta]
pub fn reposition_column(
    label: String,
    x: f32,
    y: f32,
    app_handle: tauri::AppHandle,
) -> Result<bool, String> {
    match app_handle.get_webview(&label) {
        Some(webview) => Ok(webview.set_position(LogicalPosition::new(x, y)).is_ok()),
        None => Err("Not found".into()),
    }
}

#[tauri::command(async)]
#[specta::specta]
pub fn resize_column(
    label: String,
    width: f32,
    height: f32,
    app_handle: tauri::AppHandle,
) -> Result<bool, String> {
    match app_handle.get_webview(&label) {
        Some(webview) => Ok(webview.set_size(LogicalSize::new(width, height)).is_ok()),
        None => Err("Not found".into()),
    }
}

#[tauri::command(async)]
#[specta::specta]
pub fn reload_column(label: String, app_handle: tauri::AppHandle) -> Result<bool, String> {
    match app_handle.get_webview(&label) {
        Some(webview) => Ok(webview.eval("window.location.reload()").is_ok()),
        None => Err("Not found".into()),
    }
}

#[tauri::command]
#[specta::specta]
#[cfg(target_os = "macos")]
pub fn open_window(window: Window, app_handle: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app_handle.get_window(&window.label) {
        if window.is_visible().unwrap_or_default() {
            let _ = window.set_focus();
        } else {
            let _ = window.show();
            let _ = window.set_focus();
        };
    } else {
        let window = WebviewWindowBuilder::new(
            &app_handle,
            &window.label,
            WebviewUrl::App(PathBuf::from(window.url)),
        )
        .title(&window.title)
        .min_inner_size(window.width, window.height)
        .inner_size(window.width, window.height)
        .hidden_title(true)
        .title_bar_style(TitleBarStyle::Overlay)
        .minimizable(window.minimizable)
        .maximizable(window.maximizable)
        .transparent(true)
        .effects(WindowEffectsConfig {
            state: None,
            effects: vec![Effect::UnderWindowBackground],
            radius: None,
            color: None,
        })
        .build()
        .unwrap();

        // Restore native border
        window.add_border(None);
    }

    Ok(())
}

#[tauri::command]
#[specta::specta]
#[cfg(target_os = "windows")]
pub fn open_window(window: Window, app_handle: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app_handle.get_window(&window.label) {
        if window.is_visible().unwrap_or_default() {
            let _ = window.set_focus();
        } else {
            let _ = window.show();
            let _ = window.set_focus();
        };
    } else {
        let window = WebviewWindowBuilder::new(
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
        .effects(WindowEffectsConfig {
            state: None,
            effects: vec![Effect::Mica],
            radius: None,
            color: None,
        })
        .build()
        .unwrap();

        // Set decoration
        window.create_overlay_titlebar().unwrap();
    }

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn reopen_lume(app: tauri::AppHandle) {
    if let Some(window) = app.get_window("main") {
        if window.is_visible().unwrap_or_default() {
            let _ = window.set_focus();
        } else {
            let _ = window.show();
            let _ = window.set_focus();
        };
    } else {
        let window =
            WebviewWindowBuilder::from_config(&app, app.config().app.windows.first().unwrap())
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
        window.set_traffic_lights_inset(7.0, 13.0).unwrap();

        #[cfg(target_os = "macos")]
        let win = window.clone();

        #[cfg(target_os = "macos")]
        window.on_window_event(move |event| {
            if let tauri::WindowEvent::ThemeChanged(_) = event {
                win.set_traffic_lights_inset(7.0, 13.0).unwrap();
            }
        });
    }
}

#[tauri::command]
#[specta::specta]
pub fn quit() {
    std::process::exit(0)
}
