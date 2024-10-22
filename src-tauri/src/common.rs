use futures::future::join_all;
use keyring_search::{Limit, List, Search};
use linkify::LinkFinder;
use nostr_sdk::prelude::*;
use reqwest::Client as ReqClient;
use serde::Serialize;
use specta::Type;
use std::{collections::HashSet, str::FromStr};

use crate::RichEvent;

#[derive(Debug, Clone, Serialize, Type)]
pub struct Meta {
    pub content: String,
    pub images: Vec<String>,
    pub events: Vec<String>,
    pub mentions: Vec<String>,
    pub hashtags: Vec<String>,
}

const IMAGES: [&str; 7] = ["jpg", "jpeg", "gif", "png", "webp", "avif", "tiff"];
// const VIDEOS: [&str; 6] = ["mp4", "avi", "mov", "mkv", "wmv", "webm"];

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

pub fn get_latest_event(events: &Events) -> Option<&Event> {
    events.iter().next()
}

pub fn get_tags_content(event: &Event, kind: TagKind) -> Vec<String> {
    event
        .tags
        .iter()
        .filter(|t| t.kind() == kind)
        .filter_map(|t| t.content().map(|content| content.to_string()))
        .collect()
}

pub fn create_tags(content: &str) -> Vec<Tag> {
    let mut tags: Vec<Tag> = vec![];
    let mut tag_set: HashSet<String> = HashSet::new();

    // Get words
    let words: Vec<_> = content.split_whitespace().collect();

    // Get mentions
    let mentions = words
        .iter()
        .filter(|&&word| ["nostr:", "@"].iter().any(|&el| word.starts_with(el)))
        .map(|&s| s.to_string())
        .collect::<Vec<_>>();

    // Get hashtags
    let hashtags = words
        .iter()
        .filter(|&&word| word.starts_with('#'))
        .map(|&s| s.to_string().replace("#", "").to_lowercase())
        .collect::<Vec<_>>();

    for mention in mentions {
        let entity = mention.replace("nostr:", "").replace('@', "");

        if !tag_set.contains(&entity) {
            if entity.starts_with("npub") {
                if let Ok(public_key) = PublicKey::from_bech32(&entity) {
                    let tag = Tag::public_key(public_key);
                    tags.push(tag);
                } else {
                    continue;
                }
            }
            if entity.starts_with("nprofile") {
                if let Ok(public_key) = PublicKey::from_bech32(&entity) {
                    let tag = Tag::public_key(public_key);
                    tags.push(tag);
                } else {
                    continue;
                }
            }
            if entity.starts_with("note") {
                if let Ok(event_id) = EventId::from_bech32(&entity) {
                    let hex = event_id.to_hex();
                    let tag = Tag::parse(&["e", &hex, "", "mention"]).unwrap();
                    tags.push(tag);
                } else {
                    continue;
                }
            }
            if entity.starts_with("nevent") {
                if let Ok(event) = Nip19Event::from_bech32(&entity) {
                    let hex = event.event_id.to_hex();
                    let relay = event.clone().relays.into_iter().next().unwrap_or("".into());
                    let tag = Tag::parse(&["e", &hex, &relay, "mention"]).unwrap();

                    if let Some(author) = event.author {
                        let tag = Tag::public_key(author);
                        tags.push(tag);
                    }

                    tags.push(tag);
                } else {
                    continue;
                }
            }
            tag_set.insert(entity);
        }
    }

    for hashtag in hashtags {
        if !tag_set.contains(&hashtag) {
            let tag = Tag::hashtag(hashtag.clone());
            tags.push(tag);
            tag_set.insert(hashtag);
        }
    }

    tags
}

pub fn get_all_accounts() -> Vec<String> {
    let search = Search::new().expect("Unexpected.");
    let results = search.by_service("Lume Secret Storage");
    let list = List::list_credentials(&results, Limit::All);
    let accounts: HashSet<String> = list
        .split_whitespace()
        .filter(|v| v.starts_with("npub1") && !v.ends_with("Lume"))
        .map(String::from)
        .collect();

    accounts.into_iter().collect()
}

pub async fn process_event(client: &Client, events: Events) -> Vec<RichEvent> {
    // Remove event thread if event is TextNote
    let events: Vec<Event> = events
        .into_iter()
        .filter_map(|ev| {
            if ev.kind == Kind::TextNote {
                let tags = ev
                    .tags
                    .iter()
                    .filter(|t| t.is_reply() || t.is_root())
                    .filter_map(|t| t.content())
                    .collect::<Vec<_>>();

                if tags.is_empty() {
                    Some(ev)
                } else {
                    None
                }
            } else {
                Some(ev)
            }
        })
        .collect();

    // Get deletion request by event's authors
    let ids: Vec<EventId> = events.iter().map(|ev| ev.id).collect();
    let filter = Filter::new().events(ids).kind(Kind::EventDeletion);

    let mut final_events: Vec<Event> = events.clone();

    if let Ok(requests) = client.database().query(vec![filter]).await {
        if !requests.is_empty() {
            let ids: Vec<&str> = requests
                .iter()
                .flat_map(|event| {
                    event
                        .tags
                        .iter()
                        .filter(|t| t.kind() == TagKind::e())
                        .filter_map(|t| t.content())
                        .collect::<Vec<&str>>()
                })
                .collect();

            // Remove event if event is deleted by author
            final_events = events
                .into_iter()
                .filter_map(|ev| {
                    if ids.iter().any(|&i| i == ev.id.to_hex()) {
                        None
                    } else {
                        Some(ev)
                    }
                })
                .collect();
        }
    };

    // Convert raw event to rich event
    let futures = final_events.iter().map(|ev| async move {
        let raw = ev.as_json();
        let parsed = if ev.kind == Kind::TextNote {
            Some(parse_event(&ev.content).await)
        } else {
            None
        };

        RichEvent { raw, parsed }
    });

    join_all(futures).await
}

pub async fn parse_event(content: &str) -> Meta {
    let mut finder = LinkFinder::new();
    finder.url_must_have_scheme(false);

    // Get urls
    let urls: Vec<_> = finder.links(content).collect();
    // Get words
    let words: Vec<_> = content.split_whitespace().collect();

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
    let mut text = content.to_string();

    if !urls.is_empty() {
        let client = ReqClient::new();

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
                        // Process the next item.
                        continue;
                    }
                }

                // Check the content type of URL via HEAD request
                if let Ok(res) = client.head(url_str).send().await {
                    if let Some(content_type) = res.headers().get("Content-Type") {
                        if content_type.to_str().unwrap_or("").starts_with("image") {
                            text = text.replace(url_str, "");
                            images.push(url_str.to_string());
                            // Process the next item.
                            continue;
                        }
                    }
                }
            }
        }
    }

    // Clean up the resulting content string to remove extra spaces
    let cleaned_text = text.trim().to_string();

    Meta {
        content: cleaned_text,
        events,
        mentions,
        hashtags,
        images,
    }
}
