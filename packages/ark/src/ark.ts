import { type CurrentAccount, Event, Metadata } from "@lume/types";
import { invoke } from "@tauri-apps/api/core";

export class Ark {
	public account: CurrentAccount;

	constructor() {
		this.account = { pubkey: "" };
	}

	public async verify_signer() {
		try {
			const cmd: string = await invoke("verify_signer");
			if (cmd) {
				this.account.pubkey = cmd;
				return true;
			}
			return false;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async event_to_bech32(id: string, relays: string[]) {
		try {
			const cmd: string = await invoke("event_to_bech32", {
				id,
				relays,
			});
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async get_event(id: string) {
		try {
			const cmd: string = await invoke("get_event", { id });
			const event = JSON.parse(cmd) as Event;
			return event;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async get_text_events(limit: number, until?: number) {
		try {
			const cmd: Event[] = await invoke("get_text_events", { limit, until });
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async publish(content: string) {
		try {
			const cmd: string = await invoke("publish", { content });
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async reply_to(content: string, tags: string[]) {
		try {
			const cmd: string = await invoke("reply_to", { content, tags });
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async repost(id: string, pubkey: string) {
		try {
			const cmd: string = await invoke("repost", { id, pubkey });
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async upvote(id: string, pubkey: string) {
		try {
			const cmd: string = await invoke("upvote", { id, pubkey });
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async downvote(id: string, pubkey: string) {
		try {
			const cmd: string = await invoke("downvote", { id, pubkey });
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async get_event_thread(id: string) {
		try {
			const cmd: Event[] = await invoke("get_event_thread", { id });
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public parse_event_thread({
		content,
		tags,
	}: { content: string; tags: string[][] }) {
		let rootEventId: string = null;
		let replyEventId: string = null;

		// Ignore quote repost
		if (content.includes("nostr:note1") || content.includes("nostr:nevent1"))
			return null;

		// Get all event references from tags, ignore mention
		const events = tags.filter((el) => el[0] === "e" && el[3] !== "mention");

		if (!events.length) return null;
		if (events.length === 1) {
			return {
				rootEventId: events[0][1],
				replyEventId: null,
			};
		}
		if (events.length > 1) {
			rootEventId = events.find((el) => el[3] === "root")?.[1];
			replyEventId = events.find((el) => el[3] === "reply")?.[1];

			if (!rootEventId && !replyEventId) {
				rootEventId = events[0][1];
				replyEventId = events[1][1];
			}
		}

		return {
			rootEventId,
			replyEventId,
		};
	}

	public async get_profile(id: string) {
		try {
			const cmd: Metadata = await invoke("get_profile", { id });
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async user_to_bech32(key: string, relays: string[]) {
		try {
			const cmd: string = await invoke("user_to_bech32", {
				key,
				relays,
			});
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}
}
