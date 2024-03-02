import { nip19 } from "nostr-tools";
import { EventPointer, ProfilePointer } from "nostr-tools/lib/types/nip19";

// Borrow from NDK
// https://github.com/nostr-dev-kit/ndk/blob/master/ndk/src/events/content-tagger.ts
export async function generateContentTags(content: string) {
	let promises: Promise<void>[] = [];
	let tags: string[][] = [];

	const tagRegex = /(@|nostr:)(npub|nprofile|note|nevent|naddr)[a-zA-Z0-9]+/g;
	const hashtagRegex = /#(\w+)/g;

	const addTagIfNew = (t: string[]) => {
		if (!tags.find((t2) => t2[0] === t[0] && t2[1] === t[1])) {
			tags.push(t);
		}
	};

	content = content.replace(tagRegex, (tag) => {
		try {
			const entity = tag.split(/(@|nostr:)/)[2];
			const { type, data } = nip19.decode(entity);
			let t: string[] | undefined;

			switch (type) {
				case "npub":
					t = ["p", data as string];
					break;
				case "nprofile":
					t = ["p", (data as ProfilePointer).pubkey as string];
					break;
				case "note":
					promises.push(
						new Promise(async (resolve) => {
							addTagIfNew(["e", data, "", "mention"]);
							resolve();
						}),
					);
					break;
				case "nevent":
					promises.push(
						new Promise(async (resolve) => {
							let { id, relays, author } = data as EventPointer;

							// If the nevent doesn't have a relay specified, try to get one
							if (!relays || relays.length === 0) {
								relays = [""];
							}

							addTagIfNew(["e", id, relays[0], "mention"]);
							if (author) addTagIfNew(["p", author]);
							resolve();
						}),
					);
					break;
				case "naddr":
					promises.push(
						new Promise(async (resolve) => {
							const id = [data.kind, data.pubkey, data.identifier].join(":");
							let relays = data.relays ?? [];

							// If the naddr doesn't have a relay specified, try to get one
							if (relays.length === 0) {
								relays = [""];
							}

							addTagIfNew(["a", id, relays[0], "mention"]);
							addTagIfNew(["p", data.pubkey]);
							resolve();
						}),
					);
					break;
				default:
					return tag;
			}

			if (t) addTagIfNew(t);

			return `nostr:${entity}`;
		} catch (error) {
			return tag;
		}
	});

	await Promise.all(promises);

	content = content.replace(hashtagRegex, (tag, word) => {
		const t: string[] = ["t", word];
		if (!tags.find((t2) => t2[0] === t[0] && t2[1] === t[1])) {
			tags.push(t);
		}
		return tag; // keep the original tag in the content
	});

	return { content, tags };
}
