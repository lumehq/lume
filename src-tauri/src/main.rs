#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use tauri::{Manager, WindowEvent};
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg(target_os = "macos")]
use window_ext::WindowExt;
#[cfg(target_os = "macos")]
mod window_ext;

#[derive(Clone, serde::Serialize)]
struct Payload {
  args: Vec<String>,
  cwd: String,
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      #[cfg(target_os = "macos")]
      let main_window = app.get_window("main").unwrap();

      #[cfg(target_os = "macos")]
      main_window.position_traffic_lights(8.0, 20.0); // set inset for traffic lights (macos)

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
    .plugin(
      tauri_plugin_sql::Builder::default()
        .add_migrations(
          "sqlite:lume.db",
          vec![Migration {
            version: 20230418013219,
            description: "initial data",
            sql: include_str!("../migrations/20230418013219_initial_data.sql"),
            kind: MigrationKind::Up,
          }],
        )
        .build(),
    )
    .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
      println!("{}, {argv:?}, {cwd}", app.package_info().name);
      app
        .emit_all("single-instance", Payload { args: argv, cwd })
        .unwrap();
    }))
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
