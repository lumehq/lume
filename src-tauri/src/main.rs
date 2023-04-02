#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use tauri::{Manager, WindowEvent};

#[cfg(target_os = "macos")]
use window_ext::WindowExt;
#[cfg(target_os = "macos")]
mod window_ext;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let main_window = app.get_window("main").unwrap();
      // set inset for traffic lights (macos)
      #[cfg(target_os = "macos")]
      main_window.position_traffic_lights(8.0, 20.0);

      Ok(())
    })
    .on_window_event(|e| {
      #[cfg(target_os = "macos")]
      let apply_offset = || {
        let win = e.window();
        // keep inset for traffic lights when window resize (macos)
        win.position_traffic_lights(8.0, 20.0);
      };
      #[cfg(target_os = "macos")]
      match e.event() {
        WindowEvent::Resized(..) => apply_offset(),
        WindowEvent::ThemeChanged(..) => apply_offset(),
        _ => {}
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
