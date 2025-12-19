use std::time::Duration;

use account::Account;
use anyhow::{anyhow, Error};
use common::NOSTR_CONNECT_TIMEOUT;
use gpui::prelude::FluentBuilder;
use gpui::{
    div, relative, App, AppContext, Context, Entity, EventEmitter, FocusHandle, Focusable,
    IntoElement, ParentElement, Render, SharedString, Styled, Subscription, Window,
};
use gpui_component::button::{Button, ButtonVariants};
use gpui_component::dock::{Panel, PanelEvent};
use gpui_component::input::{Input, InputEvent, InputState};
use gpui_component::notification::Notification;
use gpui_component::{v_flex, ActiveTheme, Disableable, StyledExt, WindowExt};
use nostr_connect::prelude::*;
use smallvec::{smallvec, SmallVec};
use state::client;

use crate::actions::LumeAuthUrlHandler;

pub fn init(window: &mut Window, cx: &mut App) -> Entity<Login> {
    cx.new(|cx| Login::new(window, cx))
}

pub struct Login {
    focus_handle: FocusHandle,

    /// Input for nsec for bunker uri
    key_input: Entity<InputState>,

    /// Input for decryption password when available
    pass_input: Entity<InputState>,

    /// Error message
    error: Entity<Option<SharedString>>,

    /// Timeout countdown
    countdown: Entity<Option<u64>>,

    /// Whether password is required
    require_password: bool,

    /// Whether logging in is in progress
    logging_in: bool,

    /// Event subscriptions
    _subscriptions: SmallVec<[Subscription; 1]>,
}

impl Login {
    fn new(window: &mut Window, cx: &mut Context<Self>) -> Self {
        let key_input = cx.new(|cx| InputState::new(window, cx));
        let pass_input = cx.new(|cx| InputState::new(window, cx).masked(true));

        let error = cx.new(|_| None);
        let countdown = cx.new(|_| None);

        let mut subscriptions = smallvec![];

        subscriptions.push(
            // Subscribe to key input events and process login when the user presses enter
            cx.subscribe_in(&key_input, window, |this, input, event, window, cx| {
                match event {
                    InputEvent::PressEnter { .. } => {
                        this.login(window, cx);
                    }
                    InputEvent::Change => {
                        if input.read(cx).value().starts_with("ncryptsec1") {
                            this.require_password = true;
                            cx.notify();
                        }
                    }
                    _ => {}
                };
            }),
        );

        Self {
            focus_handle: cx.focus_handle(),
            key_input,
            pass_input,
            error,
            countdown,
            logging_in: false,
            require_password: false,
            _subscriptions: subscriptions,
        }
    }

    fn login(&mut self, window: &mut Window, cx: &mut Context<Self>) {
        if self.logging_in {
            return;
        };

        // Prevent duplicate login requests
        self.set_logging_in(true, cx);

        let value = self.key_input.read(cx).value();
        let password = self.pass_input.read(cx).value();

        if value.starts_with("bunker://") {
            self.login_with_bunker(&value, window, cx);
        } else if value.starts_with("ncryptsec1") {
            self.login_with_password(&value, &password, cx);
        } else if value.starts_with("nsec1") {
            if let Ok(secret) = SecretKey::parse(&value) {
                let keys = Keys::new(secret);
                self.login_with_keys(keys, cx);
            } else {
                self.set_error("Invalid", cx);
            }
        } else {
            self.set_error("Invalid", cx);
        }
    }

    fn login_with_bunker(&mut self, content: &str, window: &mut Window, cx: &mut Context<Self>) {
        let Ok(uri) = NostrConnectUri::parse(content) else {
            self.set_error("Bunker URI is not valid", cx);
            return;
        };

        let app_keys = Keys::generate();
        let timeout = Duration::from_secs(NOSTR_CONNECT_TIMEOUT);
        let mut signer = NostrConnect::new(uri, app_keys.clone(), timeout, None).unwrap();

        // Handle auth url with the default browser
        signer.auth_url_handler(LumeAuthUrlHandler);

        // Start countdown
        cx.spawn_in(window, async move |this, cx| {
            for i in (0..=NOSTR_CONNECT_TIMEOUT).rev() {
                if i == 0 {
                    this.update(cx, |this, cx| {
                        this.set_countdown(None, cx);
                    })
                    .ok();
                } else {
                    this.update(cx, |this, cx| {
                        this.set_countdown(Some(i), cx);
                    })
                    .ok();
                }
                cx.background_executor().timer(Duration::from_secs(1)).await;
            }
        })
        .detach();

        // Handle connection
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
        })
        .detach();
    }

    fn login_with_password(&mut self, content: &str, pwd: &str, cx: &mut Context<Self>) {
        if pwd.is_empty() {
            self.set_error("Password is required", cx);
            return;
        }

        let Ok(enc) = EncryptedSecretKey::from_bech32(content) else {
            self.set_error("Secret Key is invalid", cx);
            return;
        };

        let password = pwd.to_owned();

        // Decrypt in the background to ensure it doesn't block the UI
        let task = cx.background_spawn(async move {
            if let Ok(content) = enc.decrypt(&password) {
                Ok(Keys::new(content))
            } else {
                Err(anyhow!("Invalid password"))
            }
        });

        cx.spawn(async move |this, cx| {
            let result = task.await;

            this.update(cx, |this, cx| {
                match result {
                    Ok(keys) => {
                        this.login_with_keys(keys, cx);
                    }
                    Err(e) => {
                        this.set_error(e.to_string(), cx);
                    }
                };
            })
            .ok();
        })
        .detach();
    }

    fn login_with_keys(&mut self, keys: Keys, cx: &mut Context<Self>) {
        let public_key = keys.public_key();

        cx.spawn(async move |this, cx| {
            cx.background_executor()
                .await_on_background(async move {
                    let client = client();
                    client.set_signer(keys).await;
                })
                .await;

            this.update(cx, |_this, cx| {
                let account = Account::global(cx);
                account.update(cx, |this, cx| {
                    this.set_public_key(public_key, cx);
                });
            })
            .ok();
        })
        .detach();
    }

    fn set_error<S>(&mut self, message: S, cx: &mut Context<Self>)
    where
        S: Into<SharedString>,
    {
        // Reset the log in state
        self.set_logging_in(false, cx);

        // Reset the countdown
        self.set_countdown(None, cx);

        // Update error message
        self.error.update(cx, |this, cx| {
            *this = Some(message.into());
            cx.notify();
        });

        // Clear the error message after 3 secs
        cx.spawn(async move |this, cx| {
            cx.background_executor().timer(Duration::from_secs(3)).await;

            this.update(cx, |this, cx| {
                this.error.update(cx, |this, cx| {
                    *this = None;
                    cx.notify();
                });
            })
            .ok();
        })
        .detach();
    }

    fn set_logging_in(&mut self, status: bool, cx: &mut Context<Self>) {
        self.logging_in = status;
        cx.notify();
    }

    fn set_countdown(&mut self, i: Option<u64>, cx: &mut Context<Self>) {
        self.countdown.update(cx, |this, cx| {
            *this = i;
            cx.notify();
        });
    }
}

impl Panel for Login {
    fn panel_name(&self) -> &'static str {
        "Login"
    }

    fn title(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        SharedString::from("Login")
    }
}

impl EventEmitter<PanelEvent> for Login {}

impl Focusable for Login {
    fn focus_handle(&self, _cx: &App) -> FocusHandle {
        self.focus_handle.clone()
    }
}

impl Render for Login {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        v_flex()
            .relative()
            .size_full()
            .items_center()
            .justify_center()
            .child(
                v_flex()
                    .w_96()
                    .gap_10()
                    .child(
                        div()
                            .text_center()
                            .text_lg()
                            .font_semibold()
                            .line_height(relative(1.3))
                            .child(SharedString::from("Continue with Private Key or Bunker")),
                    )
                    .child(
                        v_flex()
                            .gap_3()
                            .text_sm()
                            .child(
                                v_flex()
                                    .gap_1()
                                    .text_sm()
                                    .text_color(cx.theme().muted_foreground)
                                    .child("nsec or bunker://")
                                    .child(Input::new(&self.key_input)),
                            )
                            .when(self.require_password, |this| {
                                this.child(
                                    v_flex()
                                        .gap_1()
                                        .text_sm()
                                        .text_color(cx.theme().muted_foreground)
                                        .child("Password:")
                                        .child(Input::new(&self.pass_input)),
                                )
                            })
                            .child(
                                Button::new("login")
                                    .label("Continue")
                                    .primary()
                                    .loading(self.logging_in)
                                    .disabled(self.logging_in)
                                    .on_click(cx.listener(move |this, _, window, cx| {
                                        this.login(window, cx);
                                    })),
                            )
                            .when_some(self.countdown.read(cx).as_ref(), |this, i| {
                                let msg = format!(
                                    "Approve connection request from your signer in {} seconds",
                                    i
                                );
                                this.child(
                                    div()
                                        .text_xs()
                                        .text_center()
                                        .text_color(cx.theme().muted_foreground)
                                        .child(SharedString::from(msg)),
                                )
                            })
                            .when_some(self.error.read(cx).as_ref(), |this, error| {
                                this.child(
                                    div()
                                        .text_xs()
                                        .text_center()
                                        .text_color(cx.theme().danger_foreground)
                                        .child(error.clone()),
                                )
                            }),
                    ),
            )
    }
}
