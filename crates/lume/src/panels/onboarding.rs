use gpui::{
    div, App, AppContext, Context, Entity, EventEmitter, FocusHandle, Focusable, IntoElement,
    ParentElement, Render, SharedString, Window,
};
use gpui_component::dock::{Panel, PanelEvent};

pub fn init(window: &mut Window, cx: &mut App) -> Entity<Onboarding> {
    cx.new(|cx| Onboarding::new(window, cx))
}

pub struct Onboarding {
    focus_handle: FocusHandle,
}

impl Onboarding {
    fn new(_window: &mut Window, cx: &mut Context<Self>) -> Self {
        Self {
            focus_handle: cx.focus_handle(),
        }
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

impl Focusable for Onboarding {
    fn focus_handle(&self, _cx: &App) -> FocusHandle {
        self.focus_handle.clone()
    }
}

impl Render for Onboarding {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div().child("Onboarding")
    }
}
