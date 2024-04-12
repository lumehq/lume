use std::path::PathBuf;
#[cfg(target_os = "macos")]
use tauri::TitleBarStyle;
use tauri::{Manager, Runtime, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_shell::ShellExt;

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
  let version = app.package_info().version.to_string();
  let tray = app.tray_by_id("main_tray").unwrap();
  let menu = tauri::menu::MenuBuilder::new(app)
    .item(&tauri::menu::MenuItem::with_id(app, "open", "Open Lume", true, None::<&str>).unwrap())
    .item(&tauri::menu::MenuItem::with_id(app, "editor", "New Post", true, Some("cmd+n")).unwrap())
    .separator()
    .item(
      &tauri::menu::MenuItem::with_id(
        app,
        "version",
        format!("Version {}", version),
        false,
        None::<&str>,
      )
      .unwrap(),
    )
    .item(&tauri::menu::MenuItem::with_id(app, "about", "About Lume", true, None::<&str>).unwrap())
    .item(
      &tauri::menu::MenuItem::with_id(app, "update", "Check for Updates", true, None::<&str>)
        .unwrap(),
    )
    .item(
      &tauri::menu::MenuItem::with_id(app, "settings", "Settings...", true, Some("cmd+,")).unwrap(),
    )
    .item(&tauri::menu::MenuItem::with_id(app, "quit", "Quit", true, None::<&str>).unwrap())
    .build()
    .unwrap();
  let _ = tray.set_menu(Some(menu));

  tray.on_menu_event(move |app, event| match event.id.0.as_str() {
    "open" => {
      if let Some(window) = app.get_window("main") {
        if window.is_visible().unwrap_or_default() {
          let _ = window.set_focus();
        } else {
          let _ = window.show();
          let _ = window.set_focus();
        };
      }
    }
    "editor" => {
      if let Some(window) = app.get_window("editor-0") {
        if window.is_visible().unwrap_or_default() {
          let _ = window.set_focus();
        } else {
          let _ = window.show();
          let _ = window.set_focus();
        };
      } else {
        #[cfg(target_os = "macos")]
        let _ =
          WebviewWindowBuilder::new(app, "editor-0", WebviewUrl::App(PathBuf::from("editor")))
            .title("Editor")
            .min_inner_size(500., 400.)
            .inner_size(600., 400.)
            .hidden_title(true)
            .title_bar_style(TitleBarStyle::Overlay)
            .build()
            .unwrap();
        #[cfg(not(target_os = "macos"))]
        let _ =
          WebviewWindowBuilder::new(app, "editor-0", WebviewUrl::App(PathBuf::from("editor")))
            .title("Editor")
            .min_inner_size(500., 400.)
            .inner_size(600., 400.)
            .build()
            .unwrap();
      }
    }
    "about" => {
      app.shell().open("https://lume.nu", None).unwrap();
    }
    "update" => {
      println!("todo!")
    }
    "settings" => {
      #[cfg(target_os = "macos")]
      let _ = WebviewWindowBuilder::new(
        app,
        "settings",
        WebviewUrl::App(PathBuf::from("settings/general")),
      )
      .title("Editor")
      .min_inner_size(600., 500.)
      .inner_size(800., 500.)
      .hidden_title(true)
      .title_bar_style(TitleBarStyle::Overlay)
      .build()
      .unwrap();
      #[cfg(not(target_os = "macos"))]
      let _ = WebviewWindowBuilder::new(app, "editor-0", WebviewUrl::App(PathBuf::from("editor")))
        .title("Editor")
        .min_inner_size(500., 400.)
        .inner_size(600., 400.)
        .build()
        .unwrap();
    }
    "quit" => {
      app.exit(0);
    }
    _ => {}
  });

  Ok(())
}
