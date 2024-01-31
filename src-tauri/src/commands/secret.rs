use keyring::Entry;

#[tauri::command]
pub fn secure_save(key: String, value: String) -> Result<(), ()> {
  let entry = Entry::new("Lume", &key).expect("Failed to create entry");
  let _ = entry.set_password(&value);
  Ok(())
}

#[tauri::command]
pub fn secure_load(key: String) -> Result<String, String> {
  let entry = Entry::new("Lume", &key).expect("Failed to create entry");
  if let Ok(password) = entry.get_password() {
    Ok(password.into())
  } else {
    Err("Not found".into())
  }
}

#[tauri::command]
pub fn secure_remove(key: String) -> Result<(), ()> {
  let entry = Entry::new("Lume", &key).expect("Failed to remove entry");
  let _ = entry.delete_password();
  Ok(())
}
