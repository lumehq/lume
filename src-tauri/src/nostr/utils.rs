use std::collections::HashSet;
use std::str::FromStr;

use linkify::LinkFinder;
use nostr_sdk::{Alphabet, Event, SingleLetterTag, Tag, TagKind};
use reqwest::Client;
use serde::Serialize;
use specta::Type;
use url::Url;

#[derive(Debug, Serialize, Type)]
pub struct Meta {
  pub content: String,
  pub images: Vec<String>,
  pub videos: Vec<String>,
  pub events: Vec<String>,
  pub mentions: Vec<String>,
  pub hashtags: Vec<String>,
}

const NOSTR_EVENTS: [&str; 10] = [
  "@nevent1",
  "@note1",
  "@nostr:note1",
  "@nostr:nevent1",
  "nostr:note1",
  "note1",
  "nostr:nevent1",
  "nevent1",
  "Nostr:note1",
  "Nostr:nevent1",
];
const NOSTR_MENTIONS: [&str; 10] = [
  "@npub1",
  "nostr:npub1",
  "nostr:nprofile1",
  "nostr:naddr1",
  "npub1",
  "nprofile1",
  "naddr1",
  "Nostr:npub1",
  "Nostr:nprofile1",
  "Nostr:naddr1",
];
const IMAGES: [&str; 7] = ["jpg", "jpeg", "gif", "png", "webp", "avif", "tiff"];
const VIDEOS: [&str; 5] = ["mp4", "mov", "avi", "webm", "mkv"];

pub fn get_latest_event(events: &[Event]) -> Option<&Event> {
  events.iter().max_by_key(|event| event.created_at())
}

pub fn dedup_event(events: &[Event], nsfw: bool) -> Vec<Event> {
  let mut seen_ids = HashSet::new();
  events
    .iter()
    .filter(|&event| {
      let e = TagKind::SingleLetter(SingleLetterTag::lowercase(Alphabet::E));
      let e_tags: Vec<&Tag> = event.tags.iter().filter(|el| el.kind() == e).collect();
      let ids: Vec<&str> = e_tags.iter().filter_map(|tag| tag.content()).collect();
      let is_dup = ids.iter().any(|id| seen_ids.contains(*id));

      for id in &ids {
        seen_ids.insert(*id);
      }

      if nsfw {
        let w_tags: Vec<&Tag> = event
          .tags
          .iter()
          .filter(|el| el.kind() == TagKind::ContentWarning)
          .collect();
        !is_dup && w_tags.is_empty()
      } else {
        !is_dup
      }
    })
    .cloned()
    .collect()
}

pub async fn parse_event(content: &str) -> Meta {
  let words: Vec<_> = content.split_whitespace().collect();
  let mut finder = LinkFinder::new();
  finder.url_must_have_scheme(false);
  let urls: Vec<_> = finder.links(content).collect();

  let hashtags = words
    .iter()
    .filter(|&&word| word.starts_with('#'))
    .map(|&s| s.to_string())
    .collect::<Vec<_>>();
  let events = words
    .iter()
    .filter(|&&word| NOSTR_EVENTS.iter().any(|&el| word.starts_with(el)))
    .map(|&s| s.to_string())
    .collect::<Vec<_>>();
  let mentions = words
    .iter()
    .filter(|&&word| NOSTR_MENTIONS.iter().any(|&el| word.starts_with(el)))
    .map(|&s| s.to_string())
    .collect::<Vec<_>>();

  let mut images = Vec::new();
  let mut videos = Vec::new();
  let mut text = content.to_string();

  if !urls.is_empty() {
    let client = Client::new();

    for url in urls {
      let url_str = url.as_str();

      if let Ok(parsed_url) = Url::from_str(url_str) {
        if let Some(ext) = parsed_url
          .path_segments()
          .and_then(|segments| segments.last().and_then(|s| s.split('.').last()))
        {
          if IMAGES.contains(&ext) {
            text = text.replace(url_str, "");
            images.push(url_str.to_string());
            break;
          }
          if VIDEOS.contains(&ext) {
            text = text.replace(url_str, "");
            videos.push(url_str.to_string());
            break;
          }
        }

        // Check the content type of URL via HEAD request
        if let Ok(res) = client.head(url_str).send().await {
          if let Some(content_type) = res.headers().get("Content-Type") {
            if content_type.to_str().unwrap_or("").starts_with("image") {
              text = text.replace(url_str, "");
              images.push(url_str.to_string());
              break;
            }
          }
        }
      }
    }
  }

  // Clean up the resulting content string to remove extra spaces
  let cleaned_text = text.split_whitespace().collect::<Vec<_>>().join(" ");

  Meta {
    content: cleaned_text,
    events,
    mentions,
    hashtags,
    images,
    videos,
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use nostr_sdk::{Event, EventBuilder, Kind, Timestamp};

  #[tokio::test]
  async fn test_parse_event() {
    let content = "Check this image: https://example.com/image.jpg #cool @npub1";
    let meta = parse_event(content).await;

    assert_eq!(meta.content, "Check this image: #cool @npub1");
    assert_eq!(meta.images, vec!["https://example.com/image.jpg"]);
    assert_eq!(meta.videos, Vec::<String>::new());
    assert_eq!(meta.hashtags, vec!["#cool"]);
    assert_eq!(meta.mentions, vec!["@npub1"]);
  }

  #[tokio::test]
  async fn test_parse_video() {
    let content = "Check this video: https://example.com/video.mp4 #cool @npub1";
    let meta = parse_event(content).await;

    assert_eq!(meta.content, "Check this video: #cool @npub1");
    assert_eq!(meta.images, Vec::<String>::new());
    assert_eq!(meta.videos, vec!["https://example.com/video.mp4"]);
    assert_eq!(meta.hashtags, vec!["#cool"]);
    assert_eq!(meta.mentions, vec!["@npub1"]);
  }
}
