import { type CurrentAccount, Event, Metadata } from "@lume/types";
import { invoke } from "@tauri-apps/api/core";

export class Ark {
	public account: CurrentAccount;

	constructor() {
		this.account = null;
	}

	public async event_to_bech32(id: string, relays: string[]) {
		try {
			const cmd: string = await invoke("event_to_bech32", {
				id,
				relays,
			});
			return cmd;
		} catch {
			console.error("get nevent id failed");
		}
	}

	public async get_event(id: string) {
		try {
			const cmd: string = await invoke("get_event", { id });
			const event = JSON.parse(cmd) as Event;
			return event;
		} catch (e) {
			console.error("failed to get event", id);
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
			console.error("failed to get profile", id);
		}
	}

	public async user_to_bech32(key: string, relays: string[]) {
		try {
			const cmd: string = await invoke("user_to_bech32", {
				key,
				relays,
			});
			return cmd;
		} catch {
			console.error("get nprofile id failed");
		}
	}
}
