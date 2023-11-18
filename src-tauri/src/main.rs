#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use keyring::Entry;
use std::time::Duration;
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_sql::{Migration, MigrationKind};
use tauri_plugin_theme::ThemePlugin;
use webpage::{Webpage, WebpageOptions};

#[derive(Clone, serde::Serialize)]
struct Payload {
  args: Vec<String>,
  cwd: String,
}

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
    timeout: Duration::from_secs(15),
    useragent: "lume - desktop app".to_string(),
    ..Default::default()
  };

  let result = match Webpage::from_url(&url, options) {
    Ok(webpage) => webpage,
    Err(_) => {
      return OpenGraphResponse {
        title: "".to_string(),
        description: "".to_string(),
        url: "".to_string(),
        image: "".to_string(),
      }
    }
  };

  let html = result.html;

  return OpenGraphResponse {
    title: html
      .opengraph
      .properties
      .get("title")
      .cloned()
      .unwrap_or_default(),
    description: html
      .opengraph
      .properties
      .get("description")
      .cloned()
      .unwrap_or_default(),
    url: html
      .opengraph
      .properties
      .get("url")
      .cloned()
      .unwrap_or_default(),
    image: html
      .opengraph
      .images
      .get(0)
      .and_then(|i| Some(i.url.clone()))
      .unwrap_or_default(),
  };
}

#[tauri::command]
async fn opengraph(url: String) -> OpenGraphResponse {
  let result = fetch_opengraph(url).await;
  return result;
}

#[tauri::command]
fn secure_save(key: String, value: String) -> Result<(), ()> {
  let entry = Entry::new("lume", &key).expect("Failed to create entry");
  let _ = entry.set_password(&value);
  Ok(())
}

#[tauri::command]
fn secure_load(key: String) -> Result<String, String> {
  let entry = Entry::new("lume", &key).expect("Failed to create entry");
  if let Ok(password) = entry.get_password() {
    Ok(password)
  } else {
    Err("not found".to_string())
  }
}

#[tauri::command]
fn secure_remove(key: String) -> Result<(), ()> {
  let entry = Entry::new("lume", &key).expect("Failed to create entry");
  let _ = entry.delete_password();
  Ok(())
}

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
    .plugin(ThemePlugin::init(ctx.config_mut()))
    .plugin(
      tauri_plugin_sql::Builder::default()
        .add_migrations(
          "sqlite:lume_v2.db",
          vec![
            Migration {
              version: 20230418013219,
              description: "initial data",
              sql: include_str!("../migrations/20230418013219_initial_data.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20231028083224,
              description: "add ndk cache table",
              sql: include_str!("../migrations/20231028083224_add_ndk_cache_table.sql"),
              kind: MigrationKind::Up,
            },
          ],
        )
        .build(),
    )
    .plugin(tauri_plugin_autostart::init(
      MacosLauncher::LaunchAgent,
      Some(vec!["--flag1", "--flag2"]),
    ))
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
    .invoke_handler(tauri::generate_handler![
      opengraph,
      secure_save,
      secure_load,
      secure_remove
    ])
    .run(ctx)
    .expect("error while running tauri application");
}
