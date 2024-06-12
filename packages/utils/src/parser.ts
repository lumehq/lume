import { Meta } from "@lume/types";
import { IMAGES, NOSTR_EVENTS, NOSTR_MENTIONS, VIDEOS } from "./constants";
import { fetch } from "@tauri-apps/plugin-http";

export async function parser(
	content: string,
	abortController?: AbortController,
) {
	const words = content.split(/( |\n)/);
	const urls = content.match(/(https?:\/\/\S+)/gi);

	// Extract hashtags
	const hashtags = words.filter((word) => word.startsWith("#"));

	// Extract nostr events
	const events = words.filter((word) =>
		NOSTR_EVENTS.some((el) => word.startsWith(el)),
	);

	// Extract nostr mentions
	const mentions = words.filter((word) =>
		NOSTR_MENTIONS.some((el) => word.startsWith(el)),
	);

	// Extract images and videos from content
	const images: string[] = [];
	const videos: string[] = [];

	let text: string = content;

	if (urls) {
		for (const url of urls) {
			const ext = new URL(url).pathname.split(".")[1];

			if (IMAGES.includes(ext)) {
				text = text.replace(url, "");
				images.push(url);
				break;
			}

			if (VIDEOS.includes(ext)) {
				text = text.replace(url, "");
				videos.push(url);
				break;
			}

			if (urls.length <= 3) {
				try {
					const res = await fetch(url, {
						method: "HEAD",
						priority: "high",
						signal: abortController.signal,
						// proxy: settings.proxy;
					});

					if (res.headers.get("Content-Type").startsWith("image")) {
						text = text.replace(url, "");
						images.push(url);
						break;
					}
				} catch {
					break;
				}
			}
		}
	}

	const meta: Meta = {
		content: text.trim(),
		images,
		videos,
		events,
		mentions,
		hashtags,
	};

	return meta;
}
