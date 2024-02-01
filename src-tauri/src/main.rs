#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

pub mod commands;
pub mod nostr;

use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_sql::{Migration, MigrationKind};
use tauri_plugin_theme::ThemePlugin;

fn main() {
  let mut ctx = tauri::generate_context!();
  tauri::Builder::default()
    .setup(|app| {
      #[cfg(desktop)]
      app
        .handle()
        .plugin(tauri_plugin_updater::Builder::new().build())?;
      Ok(())
    })
    .plugin(
      tauri_plugin_sql::Builder::default()
        .add_migrations(
          "sqlite:lume_v3.db",
          vec![Migration {
            version: 20230418013219,
            description: "initial data",
            sql: include_str!("../migrations/20230418013219_initial_data.sql"),
            kind: MigrationKind::Up,
          }],
        )
        .build(),
    )
    .plugin(ThemePlugin::init(ctx.config_mut()))
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_upload::init())
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .plugin(tauri_plugin_autostart::init(
      MacosLauncher::LaunchAgent,
      Some(vec![]),
    ))
    .invoke_handler(tauri::generate_handler![
      nostr::keys::create_keys,
      nostr::keys::get_public_key,
      commands::secret::secure_save,
      commands::secret::secure_load,
      commands::secret::secure_remove,
      commands::folder::show_in_folder,
      commands::opg::fetch_opg,
    ])
    .run(ctx)
    .expect("error while running tauri application");
}
