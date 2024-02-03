#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

pub mod commands;
pub mod model;
pub mod nostr;

use nostr_sdk::{Client, ClientBuilder};
use nostr_sqlite::SQLiteDatabase;
use std::sync::Arc;
use surrealdb::{
  engine::local::{Db, RocksDb},
  Surreal,
};
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_theme::ThemePlugin;
use tokio::sync::Mutex;

pub struct AppState {
  pub db: Mutex<Surreal<Db>>,
  pub nostr: Arc<Client>,
}

fn main() {
  let mut ctx = tauri::generate_context!();
  tauri::Builder::default()
    .setup(|app| {
      let handle = app.handle().clone();
      let config_dir = app.path().app_config_dir().unwrap();

      tauri::async_runtime::spawn(async move {
        // Create app db connection
        let db = Surreal::new::<RocksDb>(config_dir.join("lume.db"))
          .await
          .expect("Initialize app db failed");

        // Select namespace and db
        db.use_ns("lume")
          .use_db("app")
          .await
          .expect("Open app db failed");

        // Create database connection
        let nostr_db = SQLiteDatabase::open(config_dir.join("nostr.db"))
          .await
          .expect("Open database failed.");

        // Create nostr connection
        let client = ClientBuilder::default().database(nostr_db).build();

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
        handle.manage(AppState {
          db: Mutex::new(db),
          nostr: client.into(),
        })
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
      nostr::keys::update_signer,
      nostr::metadata::get_metadata,
      nostr::event::get_event,
      commands::secret::secure_save,
      commands::secret::secure_load,
      commands::secret::secure_remove,
      commands::folder::show_in_folder,
      commands::opg::fetch_opg,
    ])
    .run(ctx)
    .expect("error while running tauri application");
}
