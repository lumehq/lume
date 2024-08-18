use linkify::LinkFinder;
use nostr_sdk::prelude::*;
use reqwest::Client as ReqClient;
use serde::Serialize;
use specta::Type;
use std::collections::HashSet;
use std::str::FromStr;
use std::time::Duration;

use crate::Settings;

#[derive(Debug, Clone, Serialize, Type)]
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

pub async fn init_nip65(client: &Client) {
    let signer = match client.signer().await {
        Ok(signer) => signer,
        Err(e) => {
            eprintln!("Failed to get signer: {:?}", e);
            return;
        }
    };
    let public_key = match signer.public_key().await {
        Ok(public_key) => public_key,
        Err(e) => {
            eprintln!("Failed to get public key: {:?}", e);
            return;
        }
    };

    let filter = Filter::new()
        .author(public_key)
        .kind(Kind::RelayList)
        .limit(1);

    if let Ok(events) = client
        .get_events_of(
            vec![filter],
            EventSource::both(Some(Duration::from_secs(5))),
        )
        .await
    {
        if let Some(event) = events.first() {
            let relay_list = nip65::extract_relay_list(event);
            for (url, metadata) in relay_list {
                let opts = match metadata {
                    Some(RelayMetadata::Read) => RelayOptions::new().read(true).write(false),
                    Some(_) => RelayOptions::new().write(true).read(false),
                    None => RelayOptions::default(),
                };
                if let Err(e) = client.add_relay_with_opts(&url.to_string(), opts).await {
                    eprintln!("Failed to add relay {}: {:?}", url, e);
                }
                if let Err(e) = client.connect_relay(url.to_string()).await {
                    eprintln!("Failed to connect to relay {}: {:?}", url, e);
                } else {
                    println!("Connecting to relay: {} - {:?}", url, metadata);
                }
            }
        }
    } else {
        eprintln!("Failed to get events for RelayList.");
    }
}

pub async fn get_user_settings(client: &Client) -> Result<Settings, String> {
    let ident = "lume:settings";
    let signer = client
        .signer()
        .await
        .map_err(|e| format!("Failed to get signer: {:?}", e))?;
    let public_key = signer
        .public_key()
        .await
        .map_err(|e| format!("Failed to get public key: {:?}", e))?;

    let filter = Filter::new()
        .author(public_key)
        .kind(Kind::ApplicationSpecificData)
        .identifier(ident)
        .limit(1);

    match client
        .get_events_of(
            vec![filter],
            EventSource::both(Some(Duration::from_secs(5))),
        )
        .await
    {
        Ok(events) => {
            if let Some(event) = events.first() {
                let content = event.content();
                match signer.nip44_decrypt(public_key, content).await {
                    Ok(decrypted) => match serde_json::from_str(&decrypted) {
                        Ok(parsed) => Ok(parsed),
                        Err(_) => Err("Could not parse settings payload".into()),
                    },
                    Err(e) => Err(format!("Failed to decrypt settings content: {:?}", e)),
                }
            } else {
                Err("Settings not found.".into())
            }
        }
        Err(e) => Err(format!(
            "Failed to get events for ApplicationSpecificData: {:?}",
            e
        )),
    }
}

pub fn get_latest_event(events: &[Event]) -> Option<&Event> {
    events.iter().next()
}

pub fn dedup_event(events: &[Event]) -> Vec<Event> {
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

            !is_dup
        })
        .cloned()
        .collect()
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
    let mut videos = Vec::new();
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
                    if VIDEOS.contains(&ext) {
                        text = text.replace(url_str, "");
                        videos.push(url_str.to_string());
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
        videos,
    }
}

pub fn create_event_tags(content: &str) -> Vec<Tag> {
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
        .map(|&s| s.to_string())
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

#[cfg(test)]
mod tests {
    use super::*;

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
