use std::sync::Arc;

use assets::Assets;
use common::{APP_ID, CLIENT_NAME};
use gpui::{
    div, point, px, size, AppContext, Application, Bounds, Context, IntoElement, KeyBinding, Menu,
    MenuItem, ParentElement, Render, SharedString, Styled, TitlebarOptions, Window,
    WindowBackgroundAppearance, WindowBounds, WindowDecorations, WindowKind, WindowOptions,
};
use gpui_component::button::{Button, ButtonVariants};
use gpui_component::{Root, StyledExt};

use crate::actions::{load_embedded_fonts, quit, Quit};

mod actions;

fn main() {
    // Initialize logging
    tracing_subscriber::fmt::init();

    // Initialize the Application
    let app = Application::new()
        .with_assets(Assets)
        .with_http_client(Arc::new(reqwest_client::ReqwestClient::new()));

    // Run application
    app.run(move |cx| {
        // Load embedded fonts in assets/fonts
        load_embedded_fonts(cx);

        // Register the `quit` function
        cx.on_action(quit);

        // Register the `quit` function with CMD+Q (macOS)
        #[cfg(target_os = "macos")]
        cx.bind_keys([KeyBinding::new("cmd-q", Quit, None)]);

        // Register the `quit` function with Super+Q (others)
        #[cfg(not(target_os = "macos"))]
        cx.bind_keys([KeyBinding::new("super-q", Quit, None)]);

        // Set menu items
        cx.set_menus(vec![Menu {
            name: "Lume".into(),
            items: vec![MenuItem::action("Quit", Quit)],
        }]);

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

            let view = cx.new(|_| HelloWorld);
            cx.new(|cx| Root::new(view, window, cx))
        })
        .expect("Failed to open window. Please restart the application.");
    })
}

pub struct HelloWorld;

impl Render for HelloWorld {
    fn render(&mut self, _: &mut Window, _: &mut Context<Self>) -> impl IntoElement {
        div()
            .v_flex()
            .gap_2()
            .size_full()
            .items_center()
            .justify_center()
            .child("Hello, World!")
            .child(
                Button::new("ok")
                    .primary()
                    .label("Let's Go!")
                    .on_click(|_, _, _| println!("Clicked!")),
            )
    }
}
