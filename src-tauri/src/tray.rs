use tauri::{tray::ClickType, Manager, Runtime};

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
  let menu = tauri::menu::MenuBuilder::new(app)
    .item(&tauri::menu::MenuItem::with_id(app, "quit", "Quit", true, None::<&str>).unwrap())
    .build()
    .unwrap();

  let tray = tauri::tray::TrayIconBuilder::with_id("main_tray")
    .tooltip("Lume")
    .icon(tauri::Icon::Rgba {
      rgba: include_bytes!("../icons/icon.png").to_vec(),
      width: 500,
      height: 500,
    })
    .icon_as_template(true)
    .menu(&menu)
    .build(app)
    .unwrap();

  tray.on_menu_event(move |app, event| match event.id.0.as_str() {
    "quit" => {
      let handle = app.app_handle();
      handle.exit(0);
    }
    _ => {}
  });

  tray.on_tray_icon_event(|tray, event| {
    if event.click_type == ClickType::Left {
      let app = tray.app_handle();
      if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
      }
    }
  });

  Ok(())
}
