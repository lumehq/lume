use crate::model::*;
use crate::AppState;
use tauri::State;

#[tauri::command(async)]
pub async fn create_account(
  pubkey: String,
  app_state: State<'_, AppState>,
) -> Result<Vec<Record>, ()> {
  let db = app_state.db.lock().await;

  let created: Vec<Record> = db
    .create("account")
    .content(Account {
      id: None,
      pubkey,
      is_active: true,
    })
    .await
    .expect("Create account failed");

  Ok(created)
}
