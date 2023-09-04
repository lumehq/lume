#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_sql::{Migration, MigrationKind};
use window_shadows::set_shadow;

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[derive(Clone, serde::Serialize)]
struct Payload {
  args: Vec<String>,
  cwd: String,
}

#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
  // Close splashscreen
  if let Some(splashscreen) = window.get_window("splashscreen") {
    splashscreen.close().unwrap();
  }
  // Show main window
  window.get_window("main").unwrap().show().unwrap();
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();

      #[cfg(target_os = "macos")]
      apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

      // set native shadow
      set_shadow(&window, true).expect("Unsupported platform!");

      Ok(())
    })
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
          ],
        )
        .build(),
    )
    .plugin(
      tauri_plugin_stronghold::Builder::new(|password| {
        let config = argon2::Config {
          lanes: 2,
          mem_cost: 50_000,
          time_cost: 30,
          thread_mode: argon2::ThreadMode::from_threads(2),
          variant: argon2::Variant::Argon2id,
          ..Default::default()
        };

        let key = argon2::hash_raw(
          password.as_ref(),
          b"LUME_NEED_RUST_DEVELOPER_HELP_MAKE_SALT_RANDOM",
          &config,
        )
        .expect("failed to hash password");

        key.to_vec()
      })
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
    .invoke_handler(tauri::generate_handler![close_splashscreen])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
