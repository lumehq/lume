use std::sync::Arc;
use std::time::Duration;

use account::Account;
use anyhow::Error;
use common::{CLIENT_NAME, NOSTR_CONNECT_RELAY, NOSTR_CONNECT_TIMEOUT};
use gpui::prelude::FluentBuilder;
use gpui::{
    div, img, px, relative, App, AppContext, Context, Entity, EventEmitter, FocusHandle, Focusable,
    Image, InteractiveElement, IntoElement, ParentElement, Render, SharedString,
    StatefulInteractiveElement, Styled, Task, Window,
};
use gpui_component::button::{Button, ButtonVariants};
use gpui_component::divider::Divider;
use gpui_component::dock::{Panel, PanelEvent};
use gpui_component::notification::Notification;
use gpui_component::{h_flex, v_flex, ActiveTheme, Icon, IconName, Sizable, StyledExt, WindowExt};
use nostr_connect::prelude::*;
use qrcode::render::svg;
use qrcode::QrCode;
use smallvec::{smallvec, SmallVec};
use state::client;

use crate::workspace::OpenPanel;

pub fn init(window: &mut Window, cx: &mut App) -> Entity<Onboarding> {
    cx.new(|cx| Onboarding::new(window, cx))
}

#[derive(Debug, Clone)]
pub enum NostrConnectApp {
    Nsec(String),
    Amber(String),
    Aegis(String),
}

impl NostrConnectApp {
    pub fn all() -> Vec<Self> {
        vec![
            NostrConnectApp::Nsec("https://nsec.app".to_string()),
            NostrConnectApp::Amber("https://github.com/greenart7c3/Amber".to_string()),
            NostrConnectApp::Aegis("https://github.com/ZharlieW/Aegis".to_string()),
        ]
    }

    pub fn url(&self) -> &str {
        match self {
            Self::Nsec(url) | Self::Amber(url) | Self::Aegis(url) => url,
        }
    }

    pub fn as_str(&self) -> String {
        match self {
            NostrConnectApp::Nsec(_) => "nsec.app (Desktop)".into(),
            NostrConnectApp::Amber(_) => "Amber (Android)".into(),
            NostrConnectApp::Aegis(_) => "Aegis (iOS)".into(),
        }
    }
}

/// Onboarding
pub struct Onboarding {
    focus_handle: FocusHandle,

    #[allow(dead_code)]
    /// App keys for communicating with the remote signer
    app_keys: Keys,

    /// QR code for logging in with Nostr Connect
    qr_code: Option<Arc<Image>>,

    /// Background tasks
    _tasks: SmallVec<[Task<()>; 1]>,
}

impl Onboarding {
    fn new(window: &mut Window, cx: &mut Context<Self>) -> Self {
        let app_keys = Keys::generate();
        let timeout = Duration::from_secs(NOSTR_CONNECT_TIMEOUT);
        let relay = RelayUrl::parse(NOSTR_CONNECT_RELAY).unwrap();
        let uri = NostrConnectUri::client(app_keys.public_key(), vec![relay], CLIENT_NAME);
        let qr_code = Self::generate_qr(uri.to_string().as_ref());

        // NIP46: https://github.com/nostr-protocol/nips/blob/master/46.md
        //
        // Direct connection initiated by the client
        let signer = NostrConnect::new(uri, app_keys.clone(), timeout, None).unwrap();

        let mut tasks = smallvec![];

        tasks.push(
            // Wait for nostr connect
            cx.spawn_in(window, async move |this, cx| {
                let result: Result<PublicKey, Error> = cx
                    .background_executor()
                    .await_on_background(async move {
                        let client = client();
                        let public_key = signer.get_public_key().await?;

                        // Update the signer
                        client.set_signer(signer).await;

                        // Return the URI for storing the connection
                        Ok(public_key)
                    })
                    .await;

                this.update_in(cx, |_this, window, cx| {
                    match result {
                        Ok(public_key) => {
                            let account = Account::global(cx);
                            account.update(cx, |this, cx| {
                                this.set_public_key(public_key, cx);
                            })
                        }
                        Err(e) => {
                            window.push_notification(Notification::error(e.to_string()), cx);
                        }
                    };
                })
                .ok();
            }),
        );

        Self {
            focus_handle: cx.focus_handle(),
            qr_code,
            app_keys,
            _tasks: tasks,
        }
    }

    fn generate_qr(value: &str) -> Option<Arc<Image>> {
        let code = QrCode::new(value).unwrap();
        let svg = code
            .render()
            .min_dimensions(256, 256)
            .dark_color(svg::Color("#000000"))
            .light_color(svg::Color("#FFFFFF"))
            .build();

        Some(Arc::new(Image::from_bytes(
            gpui::ImageFormat::Svg,
            svg.into_bytes(),
        )))
    }

    fn render_app<T>(&self, ix: usize, label: T, url: &str, cx: &Context<Self>) -> impl IntoElement
    where
        T: Into<SharedString>,
    {
        div()
            .id(ix)
            .flex_1()
            .rounded_md()
            .py_0p5()
            .px_2()
            .bg(cx.theme().list)
            .child(label.into())
            .on_click({
                let url = url.to_owned();
                move |_e, _window, cx| {
                    cx.open_url(&url);
                }
            })
    }

    fn render_apps(&self, cx: &Context<Self>) -> impl IntoIterator<Item = impl IntoElement> {
        let all_apps = NostrConnectApp::all();
        let mut items = Vec::with_capacity(all_apps.len());

        for (ix, item) in all_apps.into_iter().enumerate() {
            items.push(self.render_app(ix, item.as_str(), item.url(), cx));
        }

        items
    }
}

impl Panel for Onboarding {
    fn panel_name(&self) -> &'static str {
        "Onboarding"
    }

    fn title(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        SharedString::from("Onboarding")
    }
}

impl EventEmitter<PanelEvent> for Onboarding {}

impl EventEmitter<OpenPanel> for Onboarding {}

impl Focusable for Onboarding {
    fn focus_handle(&self, _: &App) -> gpui::FocusHandle {
        self.focus_handle.clone()
    }
}

impl Render for Onboarding {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        h_flex()
            .size_full()
            .child(
                v_flex()
                    .flex_1()
                    .h_full()
                    .gap_10()
                    .items_center()
                    .justify_center()
                    .child(
                        v_flex()
                            .items_center()
                            .text_center()
                            .child(
                                div()
                                    .text_xl()
                                    .font_semibold()
                                    .line_height(relative(1.3))
                                    .child(SharedString::from("Welcome to Lume")),
                            )
                            .child(
                                div()
                                    .text_color(cx.theme().muted_foreground)
                                    .child(SharedString::from("An unambitious Nostr client")),
                            ),
                    )
                    .child(
                        v_flex()
                            .w_80()
                            .gap_3()
                            .child(
                                Button::new("continue")
                                    .icon(Icon::new(IconName::ArrowRight))
                                    .label("Start Browsing")
                                    .primary()
                                    .on_click(cx.listener(move |_this, _ev, _window, cx| {
                                        cx.emit(OpenPanel::Signup);
                                    })),
                            )
                            .child(
                                Divider::horizontal()
                                    .label("Already have an account? Continue with")
                                    .text_xs(),
                            )
                            .child(
                                Button::new("key")
                                    .label("Secret Key or Bunker")
                                    .large()
                                    .link()
                                    .small()
                                    .on_click(cx.listener(move |_this, _ev, _window, cx| {
                                        cx.emit(OpenPanel::Login);
                                    })),
                            ),
                    ),
            )
            .child(
                v_flex()
                    .flex_1()
                    .size_full()
                    .items_center()
                    .justify_center()
                    .gap_5()
                    .bg(cx.theme().muted)
                    .when_some(self.qr_code.as_ref(), |this, qr| {
                        this.child(
                            img(qr.clone())
                                .size(px(256.))
                                .rounded_xl()
                                .shadow_lg()
                                .border_1()
                                .border_color(cx.theme().primary_active),
                        )
                    })
                    .child(
                        v_flex()
                            .justify_center()
                            .items_center()
                            .text_center()
                            .child(
                                div()
                                    .font_semibold()
                                    .line_height(relative(1.3))
                                    .child(SharedString::from("Continue with Nostr Connect")),
                            )
                            .child(
                                div()
                                    .text_sm()
                                    .text_color(cx.theme().muted_foreground)
                                    .child(SharedString::from(
                                        "Use Nostr Connect apps to scan the code",
                                    )),
                            )
                            .child(
                                h_flex()
                                    .mt_2()
                                    .gap_1()
                                    .text_xs()
                                    .justify_center()
                                    .children(self.render_apps(cx)),
                            ),
                    ),
            )
    }
}
