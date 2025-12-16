use std::collections::HashSet;
use std::sync::Arc;

use account::Account;
use anyhow::Error;
use common::{BOOTSTRAP_RELAYS, CLIENT_NAME, DEFAULT_SIDEBAR_WIDTH};
use gpui::{
    div, px, AppContext, Axis, Context, Entity, InteractiveElement, IntoElement, ParentElement,
    Render, Styled, Subscription, Task, Window,
};
use gpui_component::dock::{DockArea, DockItem, DockPlacement, PanelStyle};
use gpui_component::{v_flex, Root, Theme};
use nostr_sdk::prelude::*;
use person::PersonRegistry;
use smallvec::{smallvec, SmallVec};
use state::{client, StateEvent};

use crate::panels::feed::Feed;
use crate::panels::startup;
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

    /// Background tasks
    _tasks: SmallVec<[Task<Result<(), Error>>; 2]>,
}

impl Workspace {
    pub fn new(window: &mut Window, cx: &mut Context<Self>) -> Self {
        let account = Account::global(cx);

        // App's title bar
        let title_bar = cx.new(|cx| AppTitleBar::new(CLIENT_NAME, window, cx));

        // Dock area for the workspace.
        let dock =
            cx.new(|cx| DockArea::new("dock", Some(1), window, cx).panel_style(PanelStyle::TabBar));

        // Channel for communication between Nostr and GPUI
        let (tx, rx) = flume::bounded::<StateEvent>(2048);

        let mut subscriptions = smallvec![];
        let mut tasks = smallvec![];

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

        // Handle nostr notifications
        tasks.push(cx.background_spawn(async move {
            let client = client();
            let opts = SubscribeAutoCloseOptions::default().exit_policy(ReqExitPolicy::ExitOnEOSE);
            let mut notifications = client.notifications();
            let mut processed_events: HashSet<EventId> = HashSet::default();

            while let Ok(notification) = notifications.recv().await {
                let RelayPoolNotification::Message { message, .. } = notification else {
                    continue;
                };

                match message {
                    RelayMessage::Event { event, .. } => {
                        // Skip if already processed
                        if !processed_events.insert(event.id) {
                            continue;
                        }

                        match event.kind {
                            Kind::ContactList => {
                                // Get all public keys from the event
                                let public_keys: Vec<PublicKey> =
                                    event.tags.public_keys().copied().collect();

                                // Construct a filter to get metadata for each public key
                                let filter = Filter::new()
                                    .kind(Kind::Metadata)
                                    .limit(public_keys.len())
                                    .authors(public_keys);

                                // Subscribe to metadata events in the bootstrap relays
                                client
                                    .subscribe_to(BOOTSTRAP_RELAYS, filter, Some(opts))
                                    .await?;

                                // Notify GPUI of received contact list
                                tx.send_async(StateEvent::ReceivedContactList).await.ok();
                            }
                            Kind::Metadata => {
                                // Parse metadata from event, default if invalid
                                let metadata =
                                    Metadata::from_json(&event.content).unwrap_or_default();

                                // Construct nostr profile with metadata and public key
                                let profile = Box::new(Profile::new(event.pubkey, metadata));

                                // Notify GPUI of received profile
                                tx.send_async(StateEvent::ReceivedProfile(profile))
                                    .await
                                    .ok();
                            }
                            _ => {}
                        }
                    }
                    RelayMessage::EndOfStoredEvents(_) => {
                        // TODO
                    }
                    _ => {}
                }
            }
            Ok(())
        }));

        // Handle state events
        tasks.push(cx.spawn_in(window, async move |_this, cx| {
            while let Ok(event) = rx.recv_async().await {
                cx.update(|_window, cx| match event {
                    StateEvent::ReceivedContactList => {
                        let account = Account::global(cx);
                        account.update(cx, |this, cx| {
                            this.load_contacts(cx);
                        });
                    }
                    StateEvent::ReceivedProfile(profile) => {
                        let person = PersonRegistry::global(cx);
                        person.update(cx, |this, cx| {
                            this.insert_or_update(&profile, cx);
                        });
                    }
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
