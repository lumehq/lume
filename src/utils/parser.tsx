import { MentionUser } from "@shared/notes/mentions/user";
import destr from "destr";
import getUrls from "get-urls";
import { parseReferences } from "nostr-tools";
import reactStringReplace from "react-string-replace";

function isJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

export function parser(event: any) {
	if (isJsonString(event.tags)) {
		event["tags"] = destr(event.tags);
	}

	const references = parseReferences(event);
	const urls = getUrls(event.content);

	const content: {
		original: string;
		parsed: any;
		notes: string[];
		images: string[];
		videos: string[];
		links: string[];
	} = {
		original: event.content,
		parsed: event.content,
		notes: [],
		images: [],
		videos: [],
		links: [],
	};

	// remove unnecessary whitespaces
	content.parsed = content.parsed.replace(/\s{2,}/g, " ");

	// remove unnecessary linebreak
	content.parsed = content.parsed.replace(/(\r\n|\r|\n){2,}/g, "$1\n");

	// parse urls
	urls?.forEach((url: string) => {
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
		} else {
			// push to store
			content.links.push(url);
			// remove url from original content
			content.parsed = content.parsed.replace(url, "");
		}
	});

	// parse nostr
	references?.forEach((item) => {
		const profile = item.profile;
		const event = item.event;
		if (event) {
			content.notes.push(event.id);
			content.parsed = content.parsed.replace(item.text, "");
		}
		if (profile) {
			content.parsed = reactStringReplace(
				content.parsed,
				item.text,
				(match, i) => <MentionUser key={match + i} pubkey={profile.pubkey} />,
			);
		}
	});

	// parse hashtag
	content.parsed = reactStringReplace(content.parsed, /#(\w+)/g, (match, i) => (
		<a
			key={match + i}
			href={`/search/${match}`}
			className="text-fuchsia-500 hover:text-fuchsia-600 no-underline font-normal"
		>
			#{match}
		</a>
	));

	return content;
}
