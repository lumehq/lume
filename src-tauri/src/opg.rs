use std::time::Duration;
use webpage::{Webpage, WebpageOptions};

#[derive(serde::Serialize)]
pub struct OpenGraphResponse {
  title: String,
  description: String,
  url: String,
  image: String,
}

async fn fetch_opengraph(url: String) -> OpenGraphResponse {
  let options = WebpageOptions {
    allow_insecure: false,
    max_redirections: 3,
    timeout: Duration::from_secs(15),
    useragent: "lume - desktop app".to_string(),
    ..Default::default()
  };

  let result = match Webpage::from_url(&url, options) {
    Ok(webpage) => webpage,
    Err(_) => {
      return OpenGraphResponse {
        title: "".to_string(),
        description: "".to_string(),
        url: "".to_string(),
        image: "".to_string(),
      }
    }
  };

  let html = result.html;

  return OpenGraphResponse {
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
}

#[tauri::command]
pub async fn opengraph(url: String) -> OpenGraphResponse {
  let result = fetch_opengraph(url).await;
  return result;
}
