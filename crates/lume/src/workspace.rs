use std::sync::Arc;

use account::Account;
use anyhow::Error;
use common::{CLIENT_NAME, DEFAULT_SIDEBAR_WIDTH};
use gpui::{
    div, px, AppContext, Axis, Context, Entity, InteractiveElement, IntoElement, ParentElement,
    Render, Styled, Subscription, Task, Window,
};
use gpui_component::dock::{DockArea, DockItem};
use gpui_component::{v_flex, Root, Theme};
use nostr_sdk::prelude::*;
use smallvec::{smallvec, SmallVec};
use state::{client, StateEvent};

use crate::panels::startup;
use crate::sidebar;
use crate::title_bar::AppTitleBar;

#[derive(Debug)]
pub struct Workspace {
    /// The dock area for the workspace.
    dock: Entity<DockArea>,

    /// App's title bar.
    title_bar: Entity<AppTitleBar>,

    /// Event subscriptions
    _subscriptions: SmallVec<[Subscription; 1]>,

    /// Background tasks
    _tasks: SmallVec<[Task<Result<(), Error>>; 2]>,
}

impl Workspace {
    pub fn new(window: &mut Window, cx: &mut Context<Self>) -> Self {
        let dock = cx.new(|cx| DockArea::new("dock", None, window, cx));
        let title_bar = cx.new(|cx| AppTitleBar::new(CLIENT_NAME, window, cx));
        let account = Account::global(cx);

        let mut subscriptions = smallvec![];

        // Automatically sync theme with system appearance
        subscriptions.push(window.observe_window_appearance(|window, cx| {
            Theme::sync_system_appearance(Some(window), cx);
        }));

        // Observe account entity changes
        subscriptions.push(
            cx.observe_in(&account, window, move |this, state, window, cx| {
                if state.read(cx).has_account() {
                    this.init_app_layout(window, cx);
                }
            }),
        );

        let mut tasks = smallvec![];
        let (tx, rx) = flume::bounded::<StateEvent>(2048);

        // Handle nostr notifications
        tasks.push(cx.background_spawn(async move {
            let client = client();
            let mut notifications = client.notifications();

            while let Ok(notification) = notifications.recv().await {
                let RelayPoolNotification::Message { message, relay_url } = notification else {
                    continue;
                };

                match message {
                    RelayMessage::Event { event, .. } => {
                        // TODO
                    }
                    RelayMessage::EndOfStoredEvents(subscription_id) => {
                        // TODO
                    }
                    _ => {}
                }
            }

            Ok(())
        }));

        // Handle state events
        tasks.push(cx.spawn_in(window, async move |this, cx| {
            while let Ok(event) = rx.recv_async().await {
                cx.update(|window, cx| {
                    // TODO
                })
                // Entity has been released, ignore any errors
                .ok();
            }

            Ok(())
        }));

        Self {
            dock,
            title_bar,
            _subscriptions: subscriptions,
            _tasks: tasks,
        }
    }

    fn init_app_layout(&self, window: &mut Window, cx: &mut Context<Self>) {
        let weak_dock = self.dock.downgrade();

        let sidebar = Arc::new(sidebar::init(window, cx));
        let startup = Arc::new(startup::init(window, cx));

        // Construct left dock (sidebar)
        let left = DockItem::panel(sidebar);

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
