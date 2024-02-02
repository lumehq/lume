#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

pub mod commands;
pub mod nostr;

use nostr_sdk::{Client, ClientBuilder};
use nostr_sqlite::SQLiteDatabase;
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_theme::ThemePlugin;
use tokio::sync::Mutex;

struct NostrClient(Mutex<Client>);

fn main() {
  let mut ctx = tauri::generate_context!();
  tauri::Builder::default()
    .setup(|app| {
      let handle = app.handle().clone();
      let config_dir = app.path().app_config_dir().unwrap();

      tauri::async_runtime::spawn(async move {
        // Create database connection
        let database = SQLiteDatabase::open(config_dir.join("nostr.db"))
          .await
          .expect("Open database failed.");

        // Create nostr connection
        let client = ClientBuilder::default().database(database).build();

        // Add bootstrap relay
        client
          .add_relay("wss://nostr.mutinywallet.com")
          .await
          .expect("Failed to add bootstrap relay.");

        // Add bootstrap relay
        client
          .add_relay("wss://bostr.nokotaro.com")
          .await
          .expect("Failed to add bootstrap relay.");

        // Connect
        client.connect().await;

        // Init global state
        handle.manage(NostrClient(client.into()))
      });

      Ok(())
    })
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
    .plugin(tauri_plugin_updater::Builder::new().build())
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
