use std::process::Command;
use tauri::Manager;

#[tauri::command]
pub async fn show_in_folder(path: String) {
  #[cfg(target_os = "windows")]
  {
    Command::new("explorer")
      .args(["/select,", &path]) // The comma after select is not a typo
      .spawn()
      .unwrap();
  }

  #[cfg(target_os = "linux")]
  {
    use std::fs::metadata;
    use std::path::PathBuf;
    if path.contains(",") {
      // see https://gitlab.freedesktop.org/dbus/dbus/-/issues/76
      let new_path = match metadata(&path).unwrap().is_dir() {
        true => path,
        false => {
          let mut path2 = PathBuf::from(path);
          path2.pop();
          path2.into_os_string().into_string().unwrap()
        }
      };
      Command::new("xdg-open").arg(&new_path).spawn().unwrap();
    } else {
      Command::new("dbus-send")
        .args([
          "--session",
          "--dest=org.freedesktop.FileManager1",
          "--type=method_call",
          "/org/freedesktop/FileManager1",
          "org.freedesktop.FileManager1.ShowItems",
          format!("array:string:file://{path}").as_str(),
          "string:\"\"",
        ])
        .spawn()
        .unwrap();
    }
  }

  #[cfg(target_os = "macos")]
  {
    Command::new("open").args(["-R", &path]).spawn().unwrap();
  }
}

#[tauri::command]
pub fn get_all_nsecs(app_handle: tauri::AppHandle) -> Result<Vec<String>, ()> {
  let dir = app_handle.path().app_config_dir().unwrap();

  if let Ok(paths) = std::fs::read_dir(dir) {
    let files = paths
      .filter_map(|res| res.ok())
      .map(|dir_entry| dir_entry.path())
      .filter_map(|path| {
        if path.extension().map_or(false, |ext| ext == "npub") {
          Some(path.file_name().unwrap().to_str().unwrap().to_string())
        } else {
          None
        }
      })
      .collect::<Vec<_>>();

    Ok(files)
  } else {
    Err(())
  }
}
