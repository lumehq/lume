use std::path::PathBuf;
use tauri::window::{Effect, EffectsBuilder};
use tauri::{
    tray::{MouseButtonState, TrayIconEvent},
    WebviewWindowBuilder,
};
use tauri::{AppHandle, Manager, WebviewUrl};
use tauri_nspanel::ManagerExt;

use crate::macos::{
    position_menubar_panel, set_corner_radius, setup_menubar_panel_listeners,
    swizzle_to_menubar_panel,
};

pub fn create_tray_panel(account: &str, app: &AppHandle) {
    let tray = app.tray_by_id("main").unwrap();

    tray.on_tray_icon_event(|tray, event| {
        if let TrayIconEvent::Click { button_state, .. } = event {
            if button_state == MouseButtonState::Up {
                let app = tray.app_handle();
                let panel = app.get_webview_panel("panel").unwrap();

                match panel.is_visible() {
                    true => panel.order_out(None),
                    false => {
                        position_menubar_panel(app, 0.0);
                        panel.show();
                    }
                }
            }
        }
    });

    if let Some(window) = app.get_webview_window("panel") {
        let _ = window.destroy();
    };

    let mut url = "/panel/".to_owned();
    url.push_str(account);

    let window = WebviewWindowBuilder::new(app, "panel", WebviewUrl::App(PathBuf::from(url)))
        .title("Panel")
        .inner_size(350.0, 500.0)
        .fullscreen(false)
        .resizable(false)
        .visible(false)
        .decorations(false)
        .transparent(true)
        .build()
        .unwrap();

    let _ = window.set_effects(
        EffectsBuilder::new()
            .effect(Effect::Popover)
            .state(tauri::window::EffectState::FollowsWindowActiveState)
            .build(),
    );

    set_corner_radius(&window, 13.0);

    // Convert window to panel
    swizzle_to_menubar_panel(app);
    setup_menubar_panel_listeners(app);
}
