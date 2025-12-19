use std::sync::Mutex;

use gpui::{actions, App};
use nostr_connect::prelude::*;

actions!(lume, [Quit, About, Open]);

#[derive(Debug, Clone)]
pub struct LumeAuthUrlHandler;

impl AuthUrlHandler for LumeAuthUrlHandler {
    #[allow(mismatched_lifetime_syntaxes)]
    fn on_auth_url(&self, auth_url: Url) -> BoxedFuture<Result<()>> {
        Box::pin(async move {
            log::info!("Received Auth URL: {auth_url}");
            webbrowser::open(auth_url.as_str())?;
            Ok(())
        })
    }
}

pub fn load_embedded_fonts(cx: &App) {
    let asset_source = cx.asset_source();
    let font_paths = asset_source.list("fonts").unwrap();
    let embedded_fonts = Mutex::new(Vec::new());
    let executor = cx.background_executor();

    executor.block(executor.scoped(|scope| {
        for font_path in &font_paths {
            if !font_path.ends_with(".ttf") {
                continue;
            }

            scope.spawn(async {
                let font_bytes = asset_source.load(font_path).unwrap().unwrap();
                embedded_fonts.lock().unwrap().push(font_bytes);
            });
        }
    }));

    cx.text_system()
        .add_fonts(embedded_fonts.into_inner().unwrap())
        .unwrap();
}
