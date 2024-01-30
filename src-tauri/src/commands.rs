use keyring::Entry;
use std::process::Command;
use std::time::Duration;
use webpage::{Webpage, WebpageOptions};

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

#[derive(serde::Serialize)]
pub struct OpenGraphResponse {
  title: String,
  description: String,
  url: String,
  image: String,
}

pub async fn fetch_opengraph(url: String) -> OpenGraphResponse {
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
pub async fn opengraph(url: String) -> OpenGraphResponse {
  let result = fetch_opengraph(url).await;
  return result;
}

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
  let entry = Entry::new("Lume", &key).expect("Failed to create entry");
  let _ = entry.delete_password();
  Ok(())
}
