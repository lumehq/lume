use gpui::{
    div, App, AppContext, Context, Entity, EventEmitter, FocusHandle, Focusable, IntoElement,
    ParentElement, Render, Window,
};
use gpui_component::dock::{Panel, PanelEvent};

pub fn init(window: &mut Window, cx: &mut App) -> Entity<Startup> {
    cx.new(|cx| Startup::new(window, cx))
}

pub struct Startup {
    focus_handle: FocusHandle,
}

impl Startup {
    fn new(_window: &mut Window, cx: &mut Context<Self>) -> Self {
        Self {
            focus_handle: cx.focus_handle(),
        }
    }
}

impl Panel for Startup {
    fn panel_name(&self) -> &'static str {
        "Startup"
    }
}

impl EventEmitter<PanelEvent> for Startup {}

impl Focusable for Startup {
    fn focus_handle(&self, _cx: &App) -> FocusHandle {
        self.focus_handle.clone()
    }
}

impl Render for Startup {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div().child("Startup")
    }
}
