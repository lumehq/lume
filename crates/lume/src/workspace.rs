use common::CLIENT_NAME;
use gpui::{
    div, AppContext, Context, Entity, InteractiveElement, IntoElement, ParentElement, Render,
    Styled, Subscription, Window,
};
use gpui_component::dock::DockArea;
use gpui_component::{v_flex, Root, Theme};
use smallvec::{smallvec, SmallVec};

use crate::title_bar::AppTitleBar;

#[derive(Debug)]
pub struct Workspace {
    /// The dock area for the workspace.
    dock: Entity<DockArea>,

    /// App's title bar.
    title_bar: Entity<AppTitleBar>,

    /// Event subscriptions
    _subscriptions: SmallVec<[Subscription; 1]>,
}

impl Workspace {
    pub fn new(window: &mut Window, cx: &mut Context<Self>) -> Self {
        let dock = cx.new(|cx| DockArea::new("dock", None, window, cx));
        let title_bar = cx.new(|cx| AppTitleBar::new(CLIENT_NAME, window, cx));
        let mut subscriptions = smallvec![];

        subscriptions.push(
            // Automatically sync theme with system appearance
            window.observe_window_appearance(|window, cx| {
                Theme::sync_system_appearance(Some(window), cx);
            }),
        );

        Self {
            dock,
            title_bar,
            _subscriptions: subscriptions,
        }
    }
}

impl Render for Workspace {
    fn render(&mut self, window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        let dialog_layer = Root::render_dialog_layer(window, cx);
        let sheet_layer = Root::render_sheet_layer(window, cx);
        let notification_layer = Root::render_notification_layer(window, cx);

        div()
            .id("root")
            .relative()
            .size_full()
            .child(
                v_flex()
                    .size_full()
                    // Title bar
                    .child(self.title_bar.clone())
                    // Dock
                    .child(self.dock.clone()),
            )
            // Notifications
            .children(notification_layer)
            // Sheets
            .children(sheet_layer)
            // Modals
            .children(dialog_layer)
    }
}
