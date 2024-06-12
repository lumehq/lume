import type { EventWithReplies, Kind, Meta, NostrEvent } from "@lume/types";
import { commands } from "./commands";
import { generateContentTags } from "@lume/utils";

export class LumeEvent {
	public id: string;
	public pubkey: string;
	public created_at: number;
	public kind: Kind;
	public tags: string[][];
	public content: string;
	public sig: string;
	public relay?: string;
	public meta: Meta;
	#raw: NostrEvent;

	constructor(event: NostrEvent) {
		this.#raw = event;
		Object.assign(this, event);
	}

	get mentions() {
		return this.tags.filter((tag) => tag[0] === "p").map((tag) => tag[1]);
	}

	static getEventThread(tags: string[][], gossip = true) {
		let root: string = null;
		let reply: string = null;

		// Get all event references from tags, ignore mention
		const events = tags.filter((el) => el[0] === "e" && el[3] !== "mention");

		if (gossip) {
			const relays = tags
				.filter((el) => el[0] === "e" && el[2]?.length)
				.map((tag) => tag[2]);

			if (relays.length >= 1) {
				for (const relay of relays) {
					try {
						if (relay.length) {
							const url = new URL(relay);
							commands
								.connectRelay(url.toString())
								.then(() => console.log("[relay hint]: ", url));
						}
					} catch (e) {
						console.log("[relay hint] error: ", relay);
					}
				}
			}
		}

		if (events.length === 1) {
			root = events[0][1];
		}

		if (events.length > 1) {
			root = events.find((el) => el[3] === "root")?.[1] ?? events[0][1];
			reply = events.find((el) => el[3] === "reply")?.[1] ?? events[1][1];
		}

		// Fix some rare case when root === reply
		if (root && reply && root === reply) {
			reply = null;
		}

		return {
			root,
			reply,
		};
	}

	static async getReplies(id: string) {
		const query = await commands.getReplies(id);

		if (query.status === "ok") {
			const events = query.data.map((item) => {
				const raw = JSON.parse(item.raw) as EventWithReplies;

				if (item.parsed) {
					raw.meta = item.parsed;
				} else {
					raw.meta = null;
				}

				return raw;
			});

			if (events.length > 0) {
				const replies = new Set();

				for (const event of events) {
					const tags = event.tags.filter(
						(el) => el[0] === "e" && el[1] !== id && el[3] !== "mention",
					);

					if (tags.length > 0) {
						for (const tag of tags) {
							const rootIndex = events.findIndex((el) => el.id === tag[1]);

							// Relay Hint
							if (tag[2]?.length) {
								const url = new URL(tag[2]);
								commands
									.connectRelay(url.toString())
									.then(() => console.log("[relay hint]: ", url));
							}

							if (rootIndex !== -1) {
								const rootEvent = events[rootIndex];

								if (rootEvent?.replies) {
									rootEvent.replies.push(event);
								} else {
									rootEvent.replies = [event];
								}

								replies.add(event.id);
							}
						}
					}
				}

				return events.filter((ev) => !replies.has(ev.id));
			}

			return events;
		}
	}

	static async publish(
		content: string,
		reply_to?: string,
		quote?: boolean,
		nsfw?: boolean,
	) {
		const g = await generateContentTags(content);

		const eventContent = g.content;
		const eventTags = g.tags;

		if (reply_to) {
			const queryReply = await commands.getEvent(reply_to);

			if (queryReply.status === "ok") {
				const replyEvent = JSON.parse(queryReply.data.raw) as NostrEvent;
				const relayHint =
					replyEvent.tags.find((ev) => ev[0] === "e")?.[0][2] ?? "";

				if (quote) {
					eventTags.push(["e", replyEvent.id, relayHint, "mention"]);
					eventTags.push(["q", replyEvent.id]);
				} else {
					const rootEvent = replyEvent.tags.find((ev) => ev[3] === "root");

					if (rootEvent) {
						eventTags.push([
							"e",
							rootEvent[1],
							rootEvent[2] || relayHint,
							"root",
						]);
					}

					eventTags.push(["e", replyEvent.id, relayHint, "reply"]);
					eventTags.push(["p", replyEvent.pubkey]);
				}
			}
		}

		if (nsfw) {
			eventTags.push(["L", "content-warning"]);
			eventTags.push(["l", "reason", "content-warning"]);
			eventTags.push(["content-warning", "nsfw"]);
		}

		const query = await commands.publish(eventContent, eventTags);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async zap(id: string, amount: number, message: string) {
		const query = await commands.zapEvent(id, amount.toString(), message);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	public async idAsBech32() {
		const query = await commands.eventToBech32(this.id, []);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	public async pubkeyAsBech32() {
		const query = await commands.userToBech32(this.pubkey, []);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	public async repost() {
		const query = await commands.repost(JSON.stringify(this.#raw));

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}
}
