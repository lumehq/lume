import type {
	EventTag,
	EventWithReplies,
	Kind,
	Meta,
	NostrEvent,
} from "@lume/types";
import { type Result, commands } from "./commands";

export class LumeEvent {
	public id: string;
	public pubkey: string;
	public created_at: number;
	public kind: Kind;
	public tags: string[][];
	public content: string;
	public sig: string;
	public meta: Meta;
	public relay?: string;
	#raw: NostrEvent;

	constructor(event: NostrEvent) {
		this.#raw = event;
		Object.assign(this, event);
	}

	get isQuote() {
		return this.tags.filter((tag) => tag[0] === "q").length > 0;
	}

	get isConversation() {
		const tags = this.tags.filter(
			(tag) => tag[0] === "e" && tag[3] !== "mention",
		);
		return tags.length > 0;
	}

	get mentions() {
		return this.tags.filter((tag) => tag[0] === "p").map((tag) => tag[1]);
	}

	get repostId() {
		return this.tags.find((tag) => tag[0] === "e")[1];
	}

	get thread() {
		let root: EventTag = null;
		let reply: EventTag = null;

		// Get all event references from tags, ignore mention.
		const events = this.tags.filter(
			(el) => el[0] === "e" && el[3] !== "mention",
		);

		if (events.length === 1) {
			root = { id: events[0][1], relayHint: events[0][2] };
		}

		if (events.length === 2) {
			root = { id: events[0][1], relayHint: events[0][2] };
			reply = { id: events[1][1], relayHint: events[1][2] };
		}

		if (events.length > 2) {
			for (const tag of events) {
				if (tag[3] === "root") root = { id: tag[1], relayHint: tag[2] };
				if (tag[3] === "reply") reply = { id: tag[1], relayHint: tag[2] };
			}
		}

		// Fix some rare case when root same as reply
		if (root && reply && root.id === reply.id) {
			reply = null;
		}

		return {
			root,
			reply,
		};
	}

	get quote() {
		const tag = this.tags.filter(
			(tag) => tag[0] === "q" || tag[3] === "mention",
		);
		const id = tag[0][1];
		const relayHint = tag[0][2];

		return { id, relayHint };
	}

	public async getReplies(id: string) {
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

	public async zap(amount: number, message: string) {
		const query = await commands.zapEvent(this.id, amount.toString(), message);

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

	static async publish(
		content: string,
		warning?: string,
		difficulty?: number,
		reply_to?: string,
		root_to?: string,
	) {
		let query: Result<string, string>;

		if (reply_to) {
			query = await commands.reply(content, reply_to, root_to);
		} else {
			query = await commands.publish(content, warning, difficulty);
		}

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}
}
