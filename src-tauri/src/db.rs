use once_cell::sync::Lazy;

pub(crate) mod api {
  use native_db::{native_db, InnerKeyValue};
  use native_model::{native_model, Model};
  use serde::{Deserialize, Serialize};

  pub mod v1 {
    use super::*;

    #[derive(Serialize, Deserialize, Debug)]
    #[native_model(id = 1, version = 2)]
    #[native_db]
    pub struct Account {
      #[primary_key]
      pub pubkey: String,
      #[secondary_key]
      status: String,
    }
  }
}

pub static DATABASE_BUILDER: Lazy<native_db::DatabaseBuilder> = Lazy::new(|| {
  let mut builder = native_db::DatabaseBuilder::new();
  builder
    .define::<api::v1::Account>()
    .expect("failed to define model Account v1");
  builder
});
