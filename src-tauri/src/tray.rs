use tauri::{Manager, Runtime};

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
  let version = app.package_info().version.to_string();
  let tray = app.tray_by_id("main_tray").unwrap();
  let menu = tauri::menu::MenuBuilder::new(app)
    .item(
      &tauri::menu::MenuItem::with_id(app, "open_lume", "Open Lume", true, None::<&str>).unwrap(),
    )
    .item(&tauri::menu::MenuItem::with_id(app, "editor", "New Post", true, None::<&str>).unwrap())
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
      &tauri::menu::MenuItem::with_id(app, "settings", "Settings...", true, None::<&str>).unwrap(),
    )
    .item(&tauri::menu::MenuItem::with_id(app, "quit", "Quit", true, None::<&str>).unwrap())
    .build()
    .unwrap();
  let _ = tray.set_menu(Some(menu));

  tray.on_menu_event(move |app, event| match event.id.0.as_str() {
    "quit" => {
      let handle = app.app_handle();
      handle.exit(0);
    }
    _ => {}
  });

  Ok(())
}
