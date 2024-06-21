use std::path::PathBuf;
use std::str::FromStr;

#[cfg(target_os = "macos")]
use cocoa::{appkit::NSApp, base::nil, foundation::NSString};
use serde::{Deserialize, Serialize};
use specta::Type;
use tauri::{LogicalPosition, LogicalSize, Manager, State, WebviewUrl};
#[cfg(target_os = "macos")]
use tauri::TitleBarStyle;
use tauri::utils::config::WindowEffectsConfig;
use tauri::WebviewWindowBuilder;
use tauri::window::Effect;
use tauri_plugin_decorum::WebviewWindowExt;
use url::Url;

use crate::Nostr;

#[derive(Serialize, Deserialize, Type)]
pub struct Window {
  label: String,
  title: String,
  url: String,
  width: f64,
  height: f64,
  maximizable: bool,
  minimizable: bool,
}

#[tauri::command]
#[specta::specta]
pub fn create_column(
  label: &str,
  x: f32,
  y: f32,
  width: f32,
  height: f32,
  url: &str,
  app_handle: tauri::AppHandle,
  state: State<'_, Nostr>,
) -> Result<String, String> {
  let settings = state.settings.lock().unwrap().clone();

  match app_handle.get_window("main") {
    Some(main_window) => match app_handle.get_webview(label) {
      Some(_) => Ok(label.into()),
      None => {
        let path = PathBuf::from(url);
        let webview_url = WebviewUrl::App(path);
        let builder = match settings.proxy {
          Some(url) => {
            let proxy = Url::from_str(&url).unwrap();
            tauri::webview::WebviewBuilder::new(label, webview_url)
              .user_agent("Lume/4.0")
              .zoom_hotkeys_enabled(true)
              .enable_clipboard_access()
              .transparent(true)
              .proxy_url(proxy)
          }
          None => tauri::webview::WebviewBuilder::new(label, webview_url)
            .user_agent("Lume/4.0")
            .zoom_hotkeys_enabled(true)
            .enable_clipboard_access()
            .transparent(true),
        };
        match main_window.add_child(
          builder,
          LogicalPosition::new(x, y),
          LogicalSize::new(width, height),
        ) {
          Ok(webview) => Ok(webview.label().into()),
          Err(_) => Err("Create webview failed".into()),
        }
      }
    },
    None => Err("Main window not found".into()),
  }
}

#[tauri::command]
#[specta::specta]
pub fn close_column(label: &str, app_handle: tauri::AppHandle) -> Result<bool, ()> {
  match app_handle.get_webview(label) {
    Some(webview) => {
      if webview.close().is_ok() {
        Ok(true)
      } else {
        Ok(false)
      }
    }
    None => Ok(true),
  }
}

#[tauri::command]
#[specta::specta]
pub fn reposition_column(
  label: &str,
  x: f32,
  y: f32,
  app_handle: tauri::AppHandle,
) -> Result<(), String> {
  match app_handle.get_webview(label) {
    Some(webview) => {
      if webview.set_position(LogicalPosition::new(x, y)).is_ok() {
        Ok(())
      } else {
        Err("Reposition column failed".into())
      }
    }
    None => Err("Webview not found".into()),
  }
}

#[tauri::command]
#[specta::specta]
pub fn resize_column(
  label: &str,
  width: f32,
  height: f32,
  app_handle: tauri::AppHandle,
) -> Result<(), String> {
  match app_handle.get_webview(label) {
    Some(webview) => {
      if webview.set_size(LogicalSize::new(width, height)).is_ok() {
        Ok(())
      } else {
        Err("Resize column failed".into())
      }
    }
    None => Err("Webview not found".into()),
  }
}

#[tauri::command]
#[specta::specta]
pub fn open_window(window: Window, app_handle: tauri::AppHandle) -> Result<(), String> {
  if let Some(window) = app_handle.get_window(&window.label) {
    if window.is_visible().unwrap_or_default() {
      let _ = window.set_focus();
    } else {
      let _ = window.show();
      let _ = window.set_focus();
    };
  } else {
    #[cfg(target_os = "macos")]
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
    .transparent(true)
    .minimizable(window.minimizable)
    .maximizable(window.maximizable)
    .effects(WindowEffectsConfig {
      state: None,
      effects: vec![Effect::WindowBackground],
      radius: None,
      color: None,
    })
    .build()
    .unwrap();

    #[cfg(target_os = "windows")]
    let window = WebviewWindowBuilder::new(&app_handle, label, WebviewUrl::App(PathBuf::from(url)))
      .title(title)
      .min_inner_size(width, height)
      .inner_size(width, height)
      .transparent(true)
      .effects(WindowEffectsConfig {
        state: None,
        effects: vec![Effect::Mica],
        radius: None,
        color: None,
      })
      .build()
      .unwrap();

    #[cfg(target_os = "linux")]
    let window = WebviewWindowBuilder::new(&app_handle, label, WebviewUrl::App(PathBuf::from(url)))
      .title(title)
      .min_inner_size(width, height)
      .inner_size(width, height)
      .build()
      .unwrap();

    #[cfg(target_os = "windows")]
    // Create a custom titlebar for Windows
    window.create_overlay_titlebar().unwrap();
  }

  Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn set_badge(count: i32) {
  #[cfg(target_os = "macos")]
  unsafe {
    let label = if count == 0 {
      nil
    } else {
      NSString::alloc(nil).init_str(&format!("{}", count))
    };
    let dock_tile: cocoa::base::id = msg_send![NSApp(), dockTile];
    let _: cocoa::base::id = msg_send![dock_tile, setBadgeLabel: label];
  }
}

#[tauri::command]
#[specta::specta]
pub fn open_main_window(app: tauri::AppHandle) {
  if let Some(window) = app.get_window("main") {
    if window.is_visible().unwrap_or_default() {
      let _ = window.set_focus();
    } else {
      let _ = window.show();
      let _ = window.set_focus();
    };
  } else {
    let _ = WebviewWindowBuilder::from_config(&app, app.config().app.windows.first().unwrap())
      .unwrap()
      .build()
      .unwrap();
  }
}
