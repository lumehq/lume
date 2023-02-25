#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use std::time::Duration;

use tauri::{Manager, WindowEvent, SystemTray};
use webpage::{Webpage, WebpageOptions};
use window_ext::WindowExt;

mod window_ext;

#[derive(serde::Serialize)]
struct OpenGraphResponse {
  title: String,
  description: String,
  url: String,
  image: String,
}

async fn fetch_opengraph(url: String) -> OpenGraphResponse {
  let options = WebpageOptions {
    allow_insecure: false,
    max_redirections: 3,
    timeout: Duration::from_secs(30),
    useragent: "lume - desktop app".to_string(),
    ..Default::default()
  };
  let result = Webpage::from_url(&url, options).expect("Could not read from URL");
  let html = result.html;

  return OpenGraphResponse {
    title: html.opengraph.properties["title"].to_string(),
    description: html.opengraph.properties["description"].to_string(),
    url: html.opengraph.properties["url"].to_string(),
    image: html.opengraph.images[0].url.to_string(),
  };
}

#[tauri::command]
async fn opengraph(url: String) -> OpenGraphResponse {
  let result = fetch_opengraph(url).await;
  return result;
}

fn main() {
  let tray = SystemTray::new();

  tauri::Builder::default()
    .setup(|app| {
      let main_window = app.get_window("main").unwrap();
      // set inset for traffic lights
      main_window.position_traffic_lights(8.0, 16.0);

      Ok(())
    })
    .system_tray(tray)
    .invoke_handler(tauri::generate_handler![opengraph])
    .plugin(tauri_plugin_sql::Builder::default().build())
    .on_window_event(|e| {
      let apply_offset = || {
        let win = e.window();
        win.position_traffic_lights(8.0, 16.0);
      };

      match e.event() {
        WindowEvent::Resized(..) => apply_offset(),
        WindowEvent::ThemeChanged(..) => apply_offset(),
        _ => {}
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
