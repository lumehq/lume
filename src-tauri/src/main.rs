#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use tauri::{Manager, WindowEvent};
use tauri_plugin_sql::{Migration, MigrationKind};
use window_ext::WindowExt;

mod window_ext;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let main_window = app.get_window("main").unwrap();
      // set inset for traffic lights
      main_window.position_traffic_lights(8.0, 20.0);

      Ok(())
    })
    .plugin(
      tauri_plugin_sql::Builder::default()
        .add_migrations(
          "sqlite:lume.db",
          vec![Migration {
            version: 1,
            description: "create default tables",
            sql: include_str!("../migrations/20230226004139_create_tables.sql"),
            kind: MigrationKind::Up,
          }],
        )
        .build(),
    )
    .on_window_event(|e| {
      let apply_offset = || {
        let win = e.window();
        win.position_traffic_lights(8.0, 20.0);
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
