use std::sync::Arc;

use account::Account;
use common::{CLIENT_NAME, DEFAULT_SIDEBAR_WIDTH};
use gpui::{
    div, px, AppContext, Axis, Context, Entity, InteractiveElement, IntoElement, ParentElement,
    Render, Styled, Subscription, Window,
};
use gpui_component::dock::{DockArea, DockItem, DockPlacement, PanelStyle};
use gpui_component::{v_flex, Root, Theme};
use nostr_sdk::prelude::*;
use smallvec::{smallvec, SmallVec};

use crate::panels::feed::Feed;
use crate::panels::{onboarding, startup};
use crate::sidebar;
use crate::title_bar::AppTitleBar;

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub enum WorkspaceEvent {
    OpenPublicKey(PublicKey),
    OpenRelay(RelayUrl),
}

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
        // App's title bar
        let title_bar = cx.new(|cx| AppTitleBar::new(CLIENT_NAME, window, cx));

        // Dock area for the workspace.
        let dock = cx.new(|cx| {
            let startup = Arc::new(onboarding::init(window, cx));
            let mut this = DockArea::new("dock", None, window, cx).panel_style(PanelStyle::TabBar);
            this.set_center(DockItem::panel(startup), window, cx);
            this
        });

        let account = Account::global(cx);
        let mut subscriptions = smallvec![];

        // Observe account entity changes
        subscriptions.push(
            cx.observe_in(&account, window, move |this, state, window, cx| {
                if state.read(cx).has_account() {
                    this.init_app_layout(window, cx);
                }
            }),
        );

        // Automatically sync theme with system appearance
        subscriptions.push(window.observe_window_appearance(|window, cx| {
            Theme::sync_system_appearance(Some(window), cx);
        }));

        Self {
            dock,
            title_bar,
            _subscriptions: subscriptions,
        }
    }

    fn init_app_layout(&mut self, window: &mut Window, cx: &mut Context<Self>) {
        let weak_dock = self.dock.downgrade();

        let sidebar = sidebar::init(window, cx);
        let startup = Arc::new(startup::init(window, cx));

        self._subscriptions.push(cx.subscribe_in(
            &sidebar,
            window,
            |this, _sidebar, event: &WorkspaceEvent, window, cx| {
                match event {
                    WorkspaceEvent::OpenPublicKey(public_key) => {
                        let view = cx.new(|cx| Feed::new(Some(*public_key), None, window, cx));
                        this.dock.update(cx, |this, cx| {
                            this.add_panel(Arc::new(view), DockPlacement::Center, None, window, cx);
                        });
                    }
                    WorkspaceEvent::OpenRelay(relay) => {
                        let view = cx.new(|cx| Feed::new(None, Some(relay.to_owned()), window, cx));
                        this.dock.update(cx, |this, cx| {
                            this.add_panel(Arc::new(view), DockPlacement::Center, None, window, cx);
                        });
                    }
                };
            },
        ));

        // Construct left dock (sidebar)
        let left = DockItem::panel(Arc::new(sidebar));

        // Construct center dock
        let center = DockItem::split_with_sizes(
            Axis::Vertical,
            vec![DockItem::tabs(vec![startup], &weak_dock, window, cx)],
            vec![None],
            &weak_dock,
            window,
            cx,
        );

        // Update dock layout
        self.dock.update(cx, |this, cx| {
            this.set_left_dock(left, Some(px(DEFAULT_SIDEBAR_WIDTH)), true, window, cx);
            this.set_center(center, window, cx);
        });
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
