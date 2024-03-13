use std::time::Duration;
use webpage::{Opengraph, Webpage, WebpageOptions};

#[tauri::command]
pub fn fetch_opg(url: String) -> Result<Opengraph, String> {
  let mut options = WebpageOptions::default();
  options.allow_insecure = true;
  options.max_redirections = 2;
  options.timeout = Duration::from_secs(10);

  if let Ok(data) = Webpage::from_url(&url, options) {
    Ok(data.html.opengraph.into())
  } else {
    Err("Get open graph failed".into())
  }
}
