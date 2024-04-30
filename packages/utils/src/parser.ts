import { IMAGES, VIDEOS } from "./constants";

export function parser(content: string) {
	// Get clean content
	const urls = content.match(/(https?:\/\/\S+)/gi);

	// Extract images and videos from content
	let images: string[] = [];
	let videos: string[] = [];
	let text: string = content;

	if (urls) {
		for (const url of urls) {
			const ext = new URL(url).pathname.split(".")[1];

			if (IMAGES.includes(ext)) {
				text = text.replace(url, "");
				images.push(url);
			}

			if (VIDEOS.includes(ext)) {
				text = text.replace(url, "");
				videos.push(url);
			}
		}
	}

	const trimContent = text.trim().replace(/[\r\n]{2,}/g, "\n");

	return {
		content: trimContent,
		images,
		videos,
	};
}
