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
use std::{sync::Arc, vec};
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
struct GetPlebData {
  account_id: i32,
  kind: i32,
}

#[derive(Deserialize, Type)]
struct GetPlebPubkeyData {
  pubkey: String,
}

#[derive(Deserialize, Type)]
struct CreatePlebData {
  pleb_id: String,
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

#[derive(Deserialize, Type)]
struct CreateChatData {
  pubkey: String,
  created_at: i32,
  account_id: i32,
}

#[derive(Deserialize, Type)]
struct GetChatData {
  account_id: i32,
}

#[derive(Deserialize, Type)]
struct CreateChannelData {
  event_id: String,
  content: String,
  account_id: i32,
}

#[derive(Deserialize, Type)]
struct GetChannelData {
  limit: i32,
  offset: i32,
}

#[derive(Deserialize, Type)]
struct GetActiveChannelData {
  active: bool,
}

#[derive(Deserialize, Type)]
struct UpdateChannelData {
  event_id: String,
  active: bool,
}

#[derive(Clone, serde::Serialize)]
struct Payload {
  args: Vec<String>,
  cwd: String,
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
async fn get_plebs(db: DbState<'_>, data: GetPlebData) -> Result<Vec<pleb::Data>, ()> {
  db.pleb()
    .find_many(vec![
      pleb::account_id::equals(data.account_id),
      pleb::kind::equals(data.kind),
    ])
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn get_pleb_by_pubkey(
  db: DbState<'_>,
  data: GetPlebPubkeyData,
) -> Result<Option<pleb::Data>, ()> {
  db.pleb()
    .find_first(vec![pleb::pubkey::equals(data.pubkey)])
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn create_pleb(db: DbState<'_>, data: CreatePlebData) -> Result<pleb::Data, ()> {
  let pleb_id = data.pleb_id.clone();
  let metadata = data.metadata.clone();

  db.pleb()
    .upsert(
      pleb::pleb_id::equals(pleb_id),
      pleb::create(
        data.pleb_id,
        data.pubkey,
        data.kind,
        data.metadata,
        account::id::equals(data.account_id),
        vec![],
      ),
      vec![pleb::metadata::set(metadata)],
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

#[tauri::command]
async fn count_total_channels(db: DbState<'_>) -> Result<i64, ()> {
  db.channel().count(vec![]).exec().await.map_err(|_| ())
}

#[tauri::command]
async fn count_total_chats(db: DbState<'_>) -> Result<i64, ()> {
  db.chat().count(vec![]).exec().await.map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn create_channel(db: DbState<'_>, data: CreateChannelData) -> Result<channel::Data, ()> {
  db.channel()
    .upsert(
      channel::event_id::equals(data.event_id.clone()),
      channel::create(
        data.event_id,
        data.content,
        account::id::equals(data.account_id),
        vec![],
      ),
      vec![],
    )
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn update_channel(db: DbState<'_>, data: UpdateChannelData) -> Result<channel::Data, ()> {
  db.channel()
    .update(
      channel::event_id::equals(data.event_id), // Unique filter
      vec![channel::active::set(data.active)],  // Vec of updates
    )
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn get_channels(db: DbState<'_>, data: GetChannelData) -> Result<Vec<channel::Data>, ()> {
  db.channel()
    .find_many(vec![])
    .take(data.limit.into())
    .skip(data.offset.into())
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn get_active_channels(
  db: DbState<'_>,
  data: GetActiveChannelData,
) -> Result<Vec<channel::Data>, ()> {
  db.channel()
    .find_many(vec![channel::active::equals(data.active)])
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn create_chat(db: DbState<'_>, data: CreateChatData) -> Result<chat::Data, ()> {
  db.chat()
    .upsert(
      chat::pubkey::equals(data.pubkey.clone()),
      chat::create(
        data.pubkey,
        data.created_at,
        account::id::equals(data.account_id),
        vec![],
      ),
      vec![],
    )
    .exec()
    .await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta]
async fn get_chats(db: DbState<'_>, data: GetChatData) -> Result<Vec<chat::Data>, ()> {
  db.chat()
    .find_many(vec![chat::account_id::equals(data.account_id)])
    .exec()
    .await
    .map_err(|_| ())
}

#[tokio::main]
async fn main() {
  let db = PrismaClient::_builder().build().await.unwrap();

  #[cfg(debug_assertions)]
  ts::export(
    collect_types![
      get_accounts,
      create_account,
      get_plebs,
      get_pleb_by_pubkey,
      create_pleb,
      create_note,
      get_notes,
      get_latest_notes,
      get_note_by_id,
      create_channel,
      update_channel,
      get_channels,
      get_active_channels,
      create_chat,
      get_chats
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
      get_plebs,
      get_pleb_by_pubkey,
      create_pleb,
      create_note,
      get_notes,
      get_latest_notes,
      get_note_by_id,
      count_total_notes,
      count_total_channels,
      count_total_chats,
      create_channel,
      update_channel,
      get_channels,
      get_active_channels,
      create_chat,
      get_chats
    ])
    .manage(Arc::new(db))
    .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
      println!("{}, {argv:?}, {cwd}", app.package_info().name);
      app
        .emit_all("single-instance", Payload { args: argv, cwd })
        .unwrap();
    }))
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
