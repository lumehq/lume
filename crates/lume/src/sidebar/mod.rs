use common::BOOTSTRAP_RELAYS;
use gpui::{
    div, App, AppContext, Context, Entity, EventEmitter, FocusHandle, Focusable,
    InteractiveElement, IntoElement, ParentElement, Render, SharedString,
    StatefulInteractiveElement, Styled, Window,
};
use gpui_component::dock::{Panel, PanelEvent};
use gpui_component::scroll::ScrollableElement;
use gpui_component::{h_flex, v_flex, ActiveTheme, StyledExt};
use nostr_sdk::prelude::*;
use person::PersonRegistry;

use crate::workspace::OpenPanel;

pub fn init(window: &mut Window, cx: &mut App) -> Entity<Sidebar> {
    cx.new(|cx| Sidebar::new(window, cx))
}

pub struct Sidebar {
    focus_handle: FocusHandle,
}

impl Sidebar {
    fn new(_window: &mut Window, cx: &mut Context<Self>) -> Self {
        Self {
            focus_handle: cx.focus_handle(),
        }
    }
}

impl Panel for Sidebar {
    fn panel_name(&self) -> &'static str {
        "Sidebar"
    }
}

impl EventEmitter<PanelEvent> for Sidebar {}
impl EventEmitter<OpenPanel> for Sidebar {}

impl Focusable for Sidebar {
    fn focus_handle(&self, _cx: &App) -> FocusHandle {
        self.focus_handle.clone()
    }
}

impl Render for Sidebar {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        let person = PersonRegistry::global(cx);
        let contacts = Vec::new();

        v_flex()
            .id("sidebar-wrapper")
            .size_full()
            .relative()
            .px_2()
            .overflow_y_scrollbar()
            .child(
                v_flex()
                    .gap_1p5()
                    .child(
                        div()
                            .mt_4()
                            .mb_2()
                            .font_semibold()
                            .text_xs()
                            .text_color(cx.theme().muted_foreground)
                            .child("Relays"),
                    )
                    .child(v_flex().gap_2().children({
                        let mut items = Vec::with_capacity(BOOTSTRAP_RELAYS.len());

                        for (ix, relay) in BOOTSTRAP_RELAYS.into_iter().enumerate() {
                            items.push(
                                h_flex()
                                    .id(SharedString::from(format!("relay-{ix}")))
                                    .h_7()
                                    .px_2()
                                    .rounded(cx.theme().radius)
                                    .hover(|this| this.bg(cx.theme().list_hover))
                                    .child(div().text_sm().child(SharedString::from(relay)))
                                    .on_click(cx.listener(move |_this, _ev, _window, cx| {
                                        if let Ok(url) = RelayUrl::parse(relay) {
                                            cx.emit(OpenPanel::Relay(url));
                                        }
                                    })),
                            )
                        }

                        items
                    })),
            )
            .child(
                v_flex()
                    .gap_1p5()
                    .child(
                        div()
                            .mt_4()
                            .mb_2()
                            .font_semibold()
                            .text_xs()
                            .text_color(cx.theme().muted_foreground)
                            .child("Contacts"),
                    )
                    .child(v_flex().gap_2().children({
                        let mut items = Vec::with_capacity(contacts.len());

                        for (ix, contact) in contacts.iter().enumerate() {
                            let profile = person.read(cx).get(contact, cx);
                            let name = SharedString::from(profile.name());

                            items.push(
                                h_flex()
                                    .id(SharedString::from(format!("contact-{ix}")))
                                    .h_7()
                                    .px_2()
                                    .rounded(cx.theme().radius)
                                    .hover(|this| this.bg(cx.theme().list_hover))
                                    .child(div().text_sm().child(name.clone()))
                                    .on_click(cx.listener(move |_this, _ev, _window, cx| {
                                        cx.emit(OpenPanel::PublicKey(profile.public_key()));
                                    })),
                            )
                        }

                        items
                    })),
            )
    }
}
