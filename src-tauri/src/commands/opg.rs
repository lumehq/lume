use std::time::Duration;
use webpage::{Webpage, WebpageOptions};

#[derive(serde::Serialize)]
pub struct OpenGraphResponse {
  title: String,
  description: String,
  url: String,
  image: String,
}

#[tauri::command]
pub fn fetch_opg(url: String) -> Result<OpenGraphResponse, ()> {
  let mut options = WebpageOptions::default();
  options.allow_insecure = true;
  options.max_redirections = 3;
  options.timeout = Duration::from_secs(15);

  let info = Webpage::from_url(&url, options);

  if let Ok(data) = info {
    let html = data.html;
    let result = OpenGraphResponse {
      title: html
        .opengraph
        .properties
        .get("title")
        .cloned()
        .unwrap_or_default(),
      description: html
        .opengraph
        .properties
        .get("description")
        .cloned()
        .unwrap_or_default(),
      url: html
        .opengraph
        .properties
        .get("url")
        .cloned()
        .unwrap_or_default(),
      image: html
        .opengraph
        .images
        .get(0)
        .and_then(|i| Some(i.url.clone()))
        .unwrap_or_default(),
    };

    Ok(result.into())
  } else {
    Err(())
  }
}
