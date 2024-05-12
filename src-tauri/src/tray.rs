use std::path::PathBuf;
#[cfg(target_os = "macos")]
use tauri::TitleBarStyle;
use tauri::{
  utils::config::WindowEffectsConfig, window::Effect, Manager, Runtime, WebviewUrl,
  WebviewWindowBuilder,
};
use tauri_plugin_shell::ShellExt;

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
  let version = app.package_info().version.to_string();
  let tray = app.tray_by_id("main_tray").unwrap();
  let menu = tauri::menu::MenuBuilder::new(app)
    .item(&tauri::menu::MenuItem::with_id(app, "open", "Open Lume", true, None::<&str>).unwrap())
    .item(&tauri::menu::MenuItem::with_id(app, "editor", "New Post", true, Some("cmd+n")).unwrap())
    .item(&tauri::menu::MenuItem::with_id(app, "search", "Search", true, Some("cmd+k")).unwrap())
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
    .separator()
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
            .min_inner_size(560., 340.)
            .inner_size(560., 340.)
            .hidden_title(true)
            .title_bar_style(TitleBarStyle::Overlay)
            .transparent(true)
            .effects(WindowEffectsConfig {
              state: None,
              effects: vec![Effect::WindowBackground],
              radius: None,
              color: None,
            })
            .build()
            .unwrap();
        #[cfg(not(target_os = "macos"))]
        let _ =
          WebviewWindowBuilder::new(app, "editor-0", WebviewUrl::App(PathBuf::from("editor")))
            .title("Editor")
            .min_inner_size(560., 340.)
            .inner_size(560., 340.)
            .build()
            .unwrap();
      }
    }
    "search" => {
      if let Some(window) = app.get_window("search") {
        if window.is_visible().unwrap_or_default() {
          let _ = window.set_focus();
        } else {
          let _ = window.show();
          let _ = window.set_focus();
        };
      } else {
        #[cfg(target_os = "macos")]
        let _ = WebviewWindowBuilder::new(app, "search", WebviewUrl::App(PathBuf::from("search")))
          .title("Search")
          .inner_size(400., 600.)
          .minimizable(false)
          .title_bar_style(TitleBarStyle::Overlay)
          .transparent(true)
          .effects(WindowEffectsConfig {
            state: None,
            effects: vec![Effect::WindowBackground],
            radius: None,
            color: None,
          })
          .build()
          .unwrap();
        #[cfg(not(target_os = "macos"))]
        let _ = WebviewWindowBuilder::new(app, "Search", WebviewUrl::App(PathBuf::from("search")))
          .title("Search")
          .inner_size(750., 470.)
          .minimizable(false)
          .resizable(false)
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
      if let Some(window) = app.get_window("settings") {
        if window.is_visible().unwrap_or_default() {
          let _ = window.set_focus();
        } else {
          let _ = window.show();
          let _ = window.set_focus();
        };
      } else {
        #[cfg(target_os = "macos")]
        let _ = WebviewWindowBuilder::new(
          app,
          "settings",
          WebviewUrl::App(PathBuf::from("settings/general")),
        )
        .title("Settings")
        .inner_size(800., 500.)
        .title_bar_style(TitleBarStyle::Overlay)
        .hidden_title(true)
        .resizable(false)
        .minimizable(false)
        .transparent(true)
        .effects(WindowEffectsConfig {
          state: None,
          effects: vec![Effect::WindowBackground],
          radius: None,
          color: None,
        })
        .build()
        .unwrap();
        #[cfg(not(target_os = "macos"))]
        let _ = WebviewWindowBuilder::new(
          app,
          "settings",
          WebviewUrl::App(PathBuf::from("settings/general")),
        )
        .title("Settings")
        .inner_size(800., 500.)
        .resizable(false)
        .minimizable(false)
        .build()
        .unwrap();
      }
    }
    "quit" => {
      app.exit(0);
    }
    _ => {}
  });

  Ok(())
}
