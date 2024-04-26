use std::path::PathBuf;
use tauri::{LogicalPosition, LogicalSize, Manager, WebviewUrl};

#[tauri::command]
pub fn create_column(
  label: &str,
  x: f32,
  y: f32,
  width: f32,
  height: f32,
  url: &str,
  app_handle: tauri::AppHandle,
) -> Result<String, String> {
  match app_handle.get_window("main") {
    Some(main_window) => match app_handle.get_webview(label) {
      Some(_) => Ok(label.into()),
      None => {
        let path = PathBuf::from(url);
        let webview_url = WebviewUrl::App(path);
        let builder = tauri::webview::WebviewBuilder::new(label, webview_url)
          .user_agent("Lume/4.0")
          .zoom_hotkeys_enabled(true)
          .enable_clipboard_access()
          .transparent(true);
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
pub fn close_column(label: &str, app_handle: tauri::AppHandle) -> Result<bool, ()> {
  match app_handle.get_webview(label) {
    Some(webview) => {
      if let Ok(_) = webview.close() {
        Ok(true)
      } else {
        Ok(false)
      }
    }
    None => Ok(true),
  }
}

#[tauri::command]
pub fn reposition_column(
  label: &str,
  x: f32,
  y: f32,
  app_handle: tauri::AppHandle,
) -> Result<(), String> {
  match app_handle.get_webview(label) {
    Some(webview) => {
      if let Ok(_) = webview.set_position(LogicalPosition::new(x, y)) {
        Ok(())
      } else {
        Err("Reposition column failed".into())
      }
    }
    None => Err("Webview not found".into()),
  }
}

#[tauri::command]
pub fn resize_column(
  label: &str,
  width: f32,
  height: f32,
  app_handle: tauri::AppHandle,
) -> Result<(), String> {
  match app_handle.get_webview(label) {
    Some(webview) => {
      if let Ok(_) = webview.set_size(LogicalSize::new(width, height)) {
        Ok(())
      } else {
        Err("Reposition column failed".into())
      }
    }
    None => Err("Webview not found".into()),
  }
}
