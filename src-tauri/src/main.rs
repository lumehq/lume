#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use keyring::Entry;
use std::time::Duration;
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_sql::{Migration, MigrationKind};
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

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_app::init())
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
    .plugin(tauri_plugin_window::init())
    .plugin(
      tauri_plugin_sql::Builder::default()
        .add_migrations(
          "sqlite:lume.db",
          vec![
            Migration {
              version: 20230418013219,
              description: "initial data",
              sql: include_str!("../migrations/20230418013219_initial_data.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230418080146,
              description: "create chats",
              sql: include_str!("../migrations/20230418080146_create_chats.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230420040005,
              description: "insert last login to settings",
              sql: include_str!("../migrations/20230420040005_insert_last_login_to_settings.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230425023912,
              description: "add pubkey to channel",
              sql: include_str!("../migrations/20230425023912_add_pubkey_to_channel.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230425024708,
              description: "add default channels",
              sql: include_str!("../migrations/20230425024708_add_default_channels.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230425050745,
              description: "create blacklist",
              sql: include_str!("../migrations/20230425050745_add_blacklist_model.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230521092300,
              description: "create block",
              sql: include_str!("../migrations/20230521092300_add_block_model.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230617003135,
              description: "add channel messages",
              sql: include_str!("../migrations/20230617003135_add_channel_messages.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230619082415,
              description: "add replies",
              sql: include_str!("../migrations/20230619082415_add_replies.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230718072634,
              description: "clean up",
              sql: include_str!("../migrations/20230718072634_clean_up_old_tables.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230725010250,
              description: "update default relays",
              sql: include_str!("../migrations/20230725010250_update_default_relays.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230804083544,
              description: "add network to accounts",
              sql: include_str!("../migrations/20230804083544_add_network_to_account.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230808085847,
              description: "add relays",
              sql: include_str!("../migrations/20230808085847_add_relays_table.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230811074423,
              description: "rename blocks to widgets",
              sql: include_str!("../migrations/20230811074423_rename_blocks_to_widgets.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230814083543,
              description: "add events",
              sql: include_str!("../migrations/20230814083543_add_events_table.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230816090508,
              description: "clean up tables",
              sql: include_str!("../migrations/20230816090508_clean_up_tables.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230817014932,
              description: "add last login to account",
              sql: include_str!("../migrations/20230817014932_add_last_login_time_to_account.sql"),
              kind: MigrationKind::Up,
            },
            Migration {
              version: 20230918235335,
              description: "add unique to relay",
              sql: include_str!("../migrations/20230918235335_add_uniq_to_relay.sql"),
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
    .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
      println!("{}, {argv:?}, {cwd}", app.package_info().name);
      app
        .emit_all("single-instance", Payload { args: argv, cwd })
        .unwrap();
    }))
    .plugin(tauri_plugin_upload::init())
    .plugin(tauri_plugin_store::Builder::default().build())
    .invoke_handler(tauri::generate_handler![
      opengraph,
      secure_save,
      secure_load
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
