import type {
	Account,
	Event,
	EventWithReplies,
	Keys,
	Metadata,
} from "@lume/types";
import { invoke } from "@tauri-apps/api/core";
import { WebviewWindow } from "@tauri-apps/api/webview";

export class Ark {
	public account: Account;
	public accounts: Array<Account>;

	constructor() {
		this.account = { npub: "", contacts: [] };
	}

	public async get_all_accounts() {
		try {
			const accounts: Account[] = [];
			const cmd: string[] = await invoke("get_all_nsecs");

			for (const item of cmd) {
				accounts.push({ npub: item.replace(".nsec", "") });
			}

			this.accounts = accounts;
			return accounts;
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	public async load_selected_account(npub: string) {
		try {
			const fullNpub = `${npub}.nsec`;
			const cmd: boolean = await invoke("load_selected_account", {
				npub: fullNpub,
			});

			if (cmd) {
				const contacts: string[] = await invoke("get_contact_list");
				this.account.npub = npub;
				this.account.contacts = contacts;
			}

			return cmd;
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	public async create_keys() {
		try {
			const cmd: Keys = await invoke("create_keys");
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async save_account(keys: Keys) {
		try {
			const cmd: boolean = await invoke("save_key", { nsec: keys.nsec });

			if (cmd) {
				await invoke("update_signer", { nsec: keys.nsec });
				const contacts: string[] = await invoke("get_contact_list");
				this.account.npub = keys.npub;
				this.account.contacts = contacts;
			}

			return cmd;
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
			const eventId: string = id
				.replace("nostr:", "")
				.split("'")[0]
				.split(".")[0];
			const cmd: string = await invoke("get_event", { id: eventId });
			const event: Event = JSON.parse(cmd);
			return event;
		} catch (e) {
			return null;
		}
	}

	public async get_events(
		type: "local" | "global",
		limit: number,
		asOf?: number,
		dedup?: boolean,
	) {
		try {
			let until: string = undefined;
			if (asOf && asOf > 0) until = asOf.toString();

			const seenIds = new Set<string>();
			const dedupQueue = new Set<string>();

			const nostrEvents: Event[] = await invoke(`get_${type}_events`, {
				limit,
				until,
			});

			if (dedup) {
				for (const event of nostrEvents) {
					const tags = event.tags
						.filter((el) => el[0] === "e")
						?.map((item) => item[1]);

					if (tags.length) {
						for (const tag of tags) {
							if (seenIds.has(tag)) {
								dedupQueue.add(event.id);
								break;
							}

							seenIds.add(tag);
						}
					}
				}

				return nostrEvents
					.filter((event) => !dedupQueue.has(event.id))
					.sort((a, b) => b.created_at - a.created_at);
			}

			return nostrEvents.sort((a, b) => b.created_at - a.created_at);
		} catch (e) {
			return [];
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

	public async repost(id: string, author: string) {
		try {
			const cmd: string = await invoke("repost", { id, pubkey: author });
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async upvote(id: string, author: string) {
		try {
			const cmd: string = await invoke("upvote", { id, pubkey: author });
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async downvote(id: string, author: string) {
		try {
			const cmd: string = await invoke("downvote", { id, pubkey: author });
			return cmd;
		} catch (e) {
			console.error(String(e));
		}
	}

	public async get_event_thread(id: string) {
		try {
			const events: EventWithReplies[] = await invoke("get_event_thread", {
				id,
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
				const cleanEvents = events.filter((ev) => !replies.has(ev.id));
				return cleanEvents;
			}

			return events;
		} catch (e) {
			return [];
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

	public async get_profile(pubkey: string) {
		try {
			const id = pubkey
				.replace("nostr:", "")
				.split("'")[0]
				.split(".")[0]
				.split(",")[0]
				.split("?")[0];
			const cmd: Metadata = await invoke("get_profile", { id });

			return cmd;
		} catch {
			return null;
		}
	}

	public async get_contact_list() {
		try {
			const cmd: string[] = await invoke("get_contact_list");
			return cmd;
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	public async follow(id: string, alias?: string) {
		try {
			const cmd: string = await invoke("follow", { id, alias });
			return cmd;
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	public async unfollow(id: string) {
		try {
			const cmd: string = await invoke("unfollow", { id });
			return cmd;
		} catch (e) {
			console.error(e);
			return false;
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

	public async verify_nip05(pubkey: string, nip05: string) {
		try {
			const cmd: boolean = await invoke("verify_nip05", {
				key: pubkey,
				nip05,
			});
			return cmd;
		} catch {
			return false;
		}
	}

	public open_thread(id: string) {
		return new WebviewWindow(`event-${id}`, {
			title: "Thread",
			url: `/events/${id}`,
			minWidth: 500,
			width: 500,
			height: 800,
			hiddenTitle: true,
			titleBarStyle: "overlay",
		});
	}

	public open_profile(pubkey: string) {
		return new WebviewWindow(`user-${pubkey}`, {
			title: "Profile",
			url: `/users/${pubkey}`,
			minWidth: 500,
			width: 500,
			height: 800,
			hiddenTitle: true,
			titleBarStyle: "overlay",
		});
	}
}
