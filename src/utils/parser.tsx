import { Event, parseReferences } from "nostr-tools";

const getURLs = new RegExp(
	"(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal|wss|ws):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))",
	"gmi",
);

export function noteParser(event: Event) {
	const references = parseReferences(event);
	const content: {
		original: string;
		parsed: any;
		notes: string[];
		images: string[];
		videos: string[];
	} = {
		original: event.content,
		parsed: event.content,
		notes: [],
		images: [],
		videos: [],
	};

	// handle media
	content.original.match(getURLs)?.forEach((item) => {
		// make sure url is trimmed
		const url = item.trim();

		if (url.match(/\.(jpg|jpeg|gif|png|webp|avif)$/)) {
			// image url
			content.images.push(url);
			// remove url from original content
			content.parsed = content.parsed.replace(url, "");
		} else if (url.match(/\.(mp4|webm|mov|ogv|avi|mp3)$/)) {
			// video
			content.videos.push(url);
			// remove url from original content
			content.parsed = content.parsed.replace(url, "");
		}
	});

	// map hashtag to em
	content.original.match(/#(\w+)(?!:\/\/)/g)?.forEach((item) => {
		content.parsed = content.parsed.replace(
			item,
			` [${item}](https://primal.net/search/${item})`,
		);
	});

	// handle nostr mention
	references.forEach((item) => {
		const profile = item.profile;
		const event = item.event;

		if (event) {
			content.notes.push(event.id);
			content.parsed = content.parsed.replace(item.text, "");
		}

		if (profile) {
			content.parsed = content.parsed.replace(item.text, `*${profile.pubkey}*`);
		}
	});

	return content;
}
