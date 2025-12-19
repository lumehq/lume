use gpui::{
    div, App, AppContext, Context, Entity, EventEmitter, FocusHandle, Focusable, IntoElement,
    ParentElement, Render, SharedString, Window,
};
use gpui_component::dock::{Panel, PanelEvent};

pub fn init(window: &mut Window, cx: &mut App) -> Entity<NewAccount> {
    cx.new(|cx| NewAccount::new(window, cx))
}

pub struct NewAccount {
    focus_handle: FocusHandle,
}

impl NewAccount {
    fn new(_window: &mut Window, cx: &mut Context<Self>) -> Self {
        Self {
            focus_handle: cx.focus_handle(),
        }
    }
}

impl Panel for NewAccount {
    fn panel_name(&self) -> &'static str {
        "New Account"
    }

    fn title(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        SharedString::from("New Account")
    }
}

impl EventEmitter<PanelEvent> for NewAccount {}

impl Focusable for NewAccount {
    fn focus_handle(&self, _cx: &App) -> FocusHandle {
        self.focus_handle.clone()
    }
}

impl Render for NewAccount {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div().child("New Account")
    }
}
