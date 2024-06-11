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

const NOSTR_EVENTS: [&str; 10] = ["@nevent1", "@note1", "@nostr:note1", "@nostr:nevent1", "nostr:note1", "note1", "nostr:nevent1", "nevent1", "Nostr:note1", "Nostr:nevent1"];
const NOSTR_MENTIONS: [&str; 10] = ["@npub1", "nostr:npub1", "nostr:nprofile1", "nostr:naddr1", "npub1", "nprofile1", "naddr1", "Nostr:npub1", "Nostr:nprofile1", "Nostr:naddr1"];
const IMAGES: [&str; 7] = ["jpg", "jpeg", "gif", "png", "webp", "avif", "tiff"];
const VIDEOS: [&str; 5] = ["mp4", "mov", "avi", "webm", "mkv"];

pub fn get_latest_event(events: &[Event]) -> Option<&Event> {
	events.iter().max_by_key(|event| event.created_at())
}

pub fn dedup_event(events: &[Event], nsfw: bool) -> Vec<Event> {
	let mut seen_ids = HashSet::new();
	let dedup = events.iter().filter(|event| {
		let e = TagKind::SingleLetter(SingleLetterTag::lowercase(Alphabet::E));
		let e_tags: Vec<&Tag> = event.tags.iter().filter(|el| el.kind() == e).collect();
		let ids: Vec<&str> = e_tags.iter().map(|tag| tag.content().unwrap()).collect();
		let is_dup = ids.iter().any(|id| seen_ids.contains(id));

		// Add found ids to seen list
		for id in ids {
			seen_ids.insert(id);
		}

		// Filter NSFW event
		if nsfw {
			let w_tags: Vec<&Tag> = event.tags.iter().filter(|el| el.kind() == TagKind::ContentWarning).collect();
			let is_warning = !w_tags.is_empty();
			!is_dup && !is_warning
		} else {
			!is_dup
		}
	}).cloned().collect();

	dedup
}

pub async fn parse_event(content: &str) -> Meta {
	let words = content.split_whitespace();

	// Link finder
	let mut finder = LinkFinder::new();
	finder.url_must_have_scheme(false);

	// Get all urls
	let urls: Vec<_> = finder.links(content).collect();

	// Extract hashtags
	let hashtags = words.clone().filter(|word| word.starts_with('#')).collect::<Vec<_>>();

	// Extract nostr events
	let events = words.clone().filter(|word| NOSTR_EVENTS.iter().any(|&el| word.starts_with(el))).collect::<Vec<_>>();

	// Extract nostr mentions
	let mentions = words.clone().filter(|word| NOSTR_MENTIONS.iter().any(|&el| word.starts_with(el))).collect::<Vec<_>>();

	// Extract images and videos from content
	let mut images = Vec::new();
	let mut videos = Vec::new();
	let mut text = content.to_string();

	if !urls.is_empty() {
		let client = Client::new();

		for url in urls {
			let url = url.as_str();

			if let Ok(parsed_url) = Url::from_str(url) {
				if let Some(ext) = parsed_url.path_segments().and_then(|segments| segments.last()) {
					let ext = ext.split('.').last().unwrap_or("");

					if IMAGES.contains(&ext) {
						text = text.replace(url, "");
						images.push(url.to_string());
						break;
					}

					if VIDEOS.contains(&ext) {
						text = text.replace(url, "");
						videos.push(url.to_string());
						break;
					}
				}

				// Check the content type of url via HEAD request
				if let Ok(res) = client.head(url).send().await {
					if let Some(content_type) = res.headers().get("Content-Type") {
						if content_type.to_str().unwrap_or("").starts_with("image") {
							text = text.replace(url, "");
							images.push(url.to_string());
							break;
						}
					}
				}
			}
		}
	}


	Meta {
		content: text.trim().to_string(),
		events: events.iter().map(|&s| s.into()).collect(),
		mentions: mentions.iter().map(|&s| s.into()).collect(),
		hashtags: hashtags.iter().map(|&s| s.into()).collect(),
		images,
		videos,
	}
}
