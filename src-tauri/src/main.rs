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

mod db;

use db::*;
use serde::Deserialize;
use specta::{collect_types, Type};
use std::sync::Arc;
use tauri::State;
use tauri_specta::ts;

type DbState<'a> = State<'a, Arc<PrismaClient>>;

#[derive(Deserialize, Type)]
struct CreateAccountData {
  pubkey: String,
  privkey: String,
  metadata: String,
}

#[derive(Deserialize, Type)]
struct CreateFollowData {
  pubkey: String,
  kind: i32,
  metadata: String,
  account_id: i32,
}

#[tauri::command]
#[specta::specta]
async fn get_account(db: DbState<'_>) -> Result<Vec<account::Data>, ()> {
  db.account()
    .find_many(vec![account::active::equals(false)])
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn create_account(db: DbState<'_>, data: CreateAccountData) -> Result<account::Data, ()> {
  db.account()
    .create(data.pubkey, data.privkey, data.metadata, vec![])
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn create_follow(db: DbState<'_>, data: CreateFollowData) -> Result<follow::Data, ()> {
  db.follow()
    .create(
      data.pubkey,
      data.kind,
      data.metadata,
      account::id::equals(data.account_id),
      vec![],
    )
    .exec()
    .await
    .map_err(|_| ())
}

#[tokio::main]
async fn main() {
  let db = PrismaClient::_builder().build().await.unwrap();

  #[cfg(debug_assertions)]
  ts::export(
    collect_types![get_account, create_account, create_follow],
    "../src/utils/bindings.ts",
  )
  .unwrap();

  #[cfg(debug_assertions)]
  db._db_push().await.unwrap();

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
    .invoke_handler(tauri::generate_handler![
      get_account,
      create_account,
      create_follow
    ])
    .manage(Arc::new(db))
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
