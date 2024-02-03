use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

#[derive(Debug, Serialize)]
pub struct Account {
  pub id: Option<Thing>,
  pub pubkey: String,
  pub is_active: bool,
}

#[derive(Debug, Serialize)]
pub struct Column {
  pub id: Option<Thing>,
  pub title: String,
  pub content: String,
  pub kind: i32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Record {
  #[allow(dead_code)]
  pub id: Thing,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AffectedRows {
  pub rows_affected: u64,
}
