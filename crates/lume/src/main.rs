use std::sync::Arc;

use assets::Assets;
use common::{APP_ID, BOOTSTRAP_RELAYS, CLIENT_NAME, SEARCH_RELAYS};
use gpui::{
    point, px, size, AppContext, Application, Bounds, SharedString, TitlebarOptions,
    WindowBackgroundAppearance, WindowBounds, WindowDecorations, WindowKind, WindowOptions,
};
use gpui_component::Root;
use state::client;

use crate::actions::load_embedded_fonts;
use crate::workspace::Workspace;

mod actions;
mod menus;
mod panels;
mod sidebar;
mod themes;
mod title_bar;
mod workspace;

fn main() {
    // Initialize logging
    tracing_subscriber::fmt::init();

    // Initialize the Application
    let app = Application::new()
        .with_assets(Assets)
        .with_http_client(Arc::new(reqwest_client::ReqwestClient::new()));

    // Initialize the nostr client
    let client = client();

    // Establish connection to all bootstrap relays
    app.background_executor()
        .spawn_with_priority(gpui::Priority::High, async move {
            // Add bootstrap relays to the relay pool
            for url in BOOTSTRAP_RELAYS {
                client.add_relay(url).await.ok();
            }

            // Add search relays to the relay pool
            for url in SEARCH_RELAYS {
                client.add_relay(url).await.ok();
            }

            // Connect to all added relays
            client.connect().await;
        })
        .detach();

    // Run application
    app.run(move |cx| {
        // Load embedded fonts in assets/fonts
        load_embedded_fonts(cx);

        // Set up the window bounds
        let bounds = Bounds::centered(None, size(px(920.0), px(700.0)), cx);

        // Set up the window options
        let opts = WindowOptions {
            window_background: WindowBackgroundAppearance::Opaque,
            window_decorations: Some(WindowDecorations::Client),
            window_bounds: Some(WindowBounds::Windowed(bounds)),
            kind: WindowKind::Normal,
            app_id: Some(APP_ID.to_owned()),
            titlebar: Some(TitlebarOptions {
                title: Some(SharedString::new_static(CLIENT_NAME)),
                traffic_light_position: Some(point(px(9.0), px(9.0))),
                appears_transparent: true,
            }),
            ..Default::default()
        };

        // Open a window with default options
        cx.open_window(opts, |window, cx| {
            // Bring the app to the foreground
            cx.activate(true);

            // Initialize the tokio runtime
            gpui_tokio::init(cx);

            // Initialize components
            gpui_component::init(cx);

            // Initialize themes
            themes::init(cx);

            // Initialize account
            account::init(cx);

            // Initialize person registry
            person::init(cx);

            let workspace = cx.new(|cx| Workspace::new(window, cx));
            cx.new(|cx| Root::new(workspace, window, cx))
        })
        .expect("Failed to open window. Please restart the application.");
    })
}
