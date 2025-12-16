use std::time::Duration;

use anyhow::Error;
use gpui::prelude::FluentBuilder;
use gpui::{
    div, img, App, AppContext, Context, Entity, EventEmitter, FocusHandle, Focusable, IntoElement,
    ParentElement, Render, SharedString, Styled, Task, Window,
};
use gpui_component::dock::{Panel, PanelEvent};
use gpui_component::{h_flex, v_flex, ActiveTheme};
use nostr_sdk::prelude::*;
use person::PersonRegistry;
use smallvec::{smallvec, SmallVec};
use state::client;

/// Feed
pub struct Feed {
    focus_handle: FocusHandle,

    /// All notes that match the query
    notes: Entity<Option<Events>>,

    /// Public Key
    public_key: Option<PublicKey>,

    /// Relay Url
    relay_url: Option<RelayUrl>,

    /// Async operations
    _tasks: SmallVec<[Task<Result<(), Error>>; 1]>,
}

impl Feed {
    pub fn new(
        public_key: Option<PublicKey>,
        relay_url: Option<RelayUrl>,
        window: &mut Window,
        cx: &mut Context<Self>,
    ) -> Self {
        let notes = cx.new(|_| None);
        let async_url = relay_url.clone();
        let mut tasks = smallvec![];

        tasks.push(
            // Load newsfeed in the background
            cx.spawn_in(window, async move |this, cx| {
                let task: Task<Result<Events, Error>> = cx.background_spawn(async move {
                    let client = client();

                    let mut filter = Filter::new()
                        .kinds(vec![Kind::TextNote, Kind::Repost])
                        .limit(20);

                    if let Some(author) = public_key {
                        filter = filter.author(author);
                    };

                    let events = match async_url {
                        Some(url) => {
                            client
                                .fetch_events_from(vec![url], filter, Duration::from_secs(5))
                                .await?
                        }
                        None => client.fetch_events(filter, Duration::from_secs(5)).await?,
                    };

                    Ok(events)
                });

                if let Ok(events) = task.await {
                    this.update(cx, |this, cx| {
                        this.notes.update(cx, |this, cx| {
                            *this = Some(events);
                            cx.notify();
                        });
                    })
                    .ok();
                }

                Ok(())
            }),
        );

        Self {
            focus_handle: cx.focus_handle(),
            notes,
            public_key,
            relay_url,
            _tasks: tasks,
        }
    }
}

impl Panel for Feed {
    fn panel_name(&self) -> &'static str {
        "Feed"
    }

    fn title(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .when_some(self.public_key.as_ref(), |this, public_key| {
                let person = PersonRegistry::global(cx);
                let profile = person.read(cx).get(public_key, cx);

                this.child(
                    h_flex()
                        .gap_1()
                        .when_some(profile.metadata().picture.as_ref(), |this, url| {
                            this.child(img(SharedString::from(url)).size_4().rounded_full())
                        })
                        .child(SharedString::from(profile.name())),
                )
            })
            .when_some(self.relay_url.as_ref(), |this, url| {
                this.child(SharedString::from(url.to_string()))
            })
    }
}

impl EventEmitter<PanelEvent> for Feed {}

impl Focusable for Feed {
    fn focus_handle(&self, _cx: &App) -> FocusHandle {
        self.focus_handle.clone()
    }
}

impl Render for Feed {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        let person = PersonRegistry::global(cx);

        v_flex()
            .p_2()
            .gap_3()
            .when_some(self.notes.read(cx).as_ref(), |this, notes| {
                this.children({
                    let mut items = Vec::with_capacity(notes.len());

                    for note in notes.iter() {
                        let profile = person.read(cx).get(&note.pubkey, cx);

                        items.push(
                            v_flex()
                                .w_full()
                                .gap_2()
                                .child(
                                    h_flex()
                                        .w_full()
                                        .items_center()
                                        .justify_between()
                                        .text_sm()
                                        .text_color(cx.theme().muted_foreground)
                                        .child(
                                            h_flex()
                                                .gap_1()
                                                .when_some(
                                                    profile.metadata().picture.as_ref(),
                                                    |this, url| {
                                                        this.child(
                                                            img(SharedString::from(url))
                                                                .size_6()
                                                                .rounded_full(),
                                                        )
                                                    },
                                                )
                                                .child(SharedString::from(profile.name())),
                                        )
                                        .child(SharedString::from(
                                            note.created_at.to_human_datetime(),
                                        )),
                                )
                                .child(SharedString::from(note.content.clone())),
                        );
                    }

                    items
                })
            })
    }
}
