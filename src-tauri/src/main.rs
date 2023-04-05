#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use prisma_client_rust::Direction;
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
struct GetFollowData {
  account_id: i32,
}

#[derive(Deserialize, Type)]
struct CreateFollowData {
  pubkey: String,
  kind: i32,
  metadata: String,
  account_id: i32,
}

#[derive(Deserialize, Type)]
struct CreateNoteData {
  event_id: String,
  pubkey: String,
  kind: i32,
  tags: String,
  content: String,
  parent_id: String,
  parent_comment_id: String,
  created_at: i32,
  account_id: i32,
}

#[derive(Deserialize, Type)]
struct GetNoteByIdData {
  event_id: String,
}

#[derive(Deserialize, Type)]
struct GetNoteData {
  date: i32,
  limit: i32,
  offset: i32,
}

#[derive(Deserialize, Type)]
struct GetLatestNoteData {
  date: i32,
}

#[tauri::command]
#[specta::specta]
async fn get_accounts(db: DbState<'_>) -> Result<Vec<account::Data>, ()> {
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
async fn get_follows(db: DbState<'_>, data: GetFollowData) -> Result<Vec<follow::Data>, ()> {
  db.follow()
    .find_many(vec![follow::account_id::equals(data.account_id)])
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

#[tauri::command]
#[specta::specta]
async fn create_note(db: DbState<'_>, data: CreateNoteData) -> Result<note::Data, ()> {
  let event_id = data.event_id.clone();
  let content = data.content.clone();

  db.note()
    .upsert(
      note::event_id::equals(event_id),
      note::create(
        data.event_id,
        data.pubkey,
        data.kind,
        data.tags,
        data.content,
        data.parent_id,
        data.parent_comment_id,
        data.created_at,
        account::id::equals(data.account_id),
        vec![],
      ),
      vec![note::content::set(content)],
    )
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn get_notes(db: DbState<'_>, data: GetNoteData) -> Result<Vec<note::Data>, ()> {
  db.note()
    .find_many(vec![note::created_at::lte(data.date)])
    .order_by(note::created_at::order(Direction::Desc))
    .take(data.limit.into())
    .skip(data.offset.into())
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn get_latest_notes(db: DbState<'_>, data: GetLatestNoteData) -> Result<Vec<note::Data>, ()> {
  db.note()
    .find_many(vec![note::created_at::gt(data.date)])
    .order_by(note::created_at::order(Direction::Desc))
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn get_note_by_id(db: DbState<'_>, data: GetNoteByIdData) -> Result<Option<note::Data>, ()> {
  db.note()
    .find_unique(note::event_id::equals(data.event_id))
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
async fn count_total_notes(db: DbState<'_>) -> Result<i64, ()> {
  db.note().count(vec![]).exec().await.map_err(|_| ())
}

#[tokio::main]
async fn main() {
  let db = PrismaClient::_builder().build().await.unwrap();

  #[cfg(debug_assertions)]
  ts::export(
    collect_types![
      get_accounts,
      create_account,
      get_follows,
      create_follow,
      create_note,
      get_notes,
      get_latest_notes,
      get_note_by_id
    ],
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
      get_accounts,
      create_account,
      get_follows,
      create_follow,
      create_note,
      get_notes,
      get_latest_notes,
      get_note_by_id,
      count_total_notes
    ])
    .manage(Arc::new(db))
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
