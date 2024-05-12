import {
	type Contact,
	type Event,
	type EventWithReplies,
	type Interests,
	type Keys,
	Kind,
	type LumeColumn,
	type Metadata,
	type Settings,
	Relays,
} from "@lume/types";
import { generateContentTags } from "@lume/utils";
import { invoke } from "@tauri-apps/api/core";
import type { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";

enum NSTORE_KEYS {
	settings = "lume_user_settings",
	interests = "lume_user_interests",
	columns = "lume_user_columns",
}

export class Ark {
	public windows: WebviewWindow[];
	public settings: Settings;
	public accounts: string[];

	constructor() {
		this.windows = [];
		this.settings = undefined;
	}

	public async get_all_accounts() {
		try {
			const cmd: string[] = await invoke("get_accounts");
			const accounts: string[] = cmd.map((item) => item.replace(".npub", ""));

			if (!this.accounts) this.accounts = accounts;

			return accounts;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async load_selected_account(npub: string) {
		try {
			const cmd: boolean = await invoke("load_selected_account", {
				npub,
			});
			return cmd;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async nostr_connect(uri: string) {
		try {
			const remoteKey = uri.replace("bunker://", "").split("?")[0];
			const npub: string = await invoke("to_npub", { hex: remoteKey });

			if (npub) {
				const connect: string = await invoke("nostr_connect", {
					npub,
					uri,
				});

				return connect;
			}
		} catch (e) {
			throw new Error(String(e));
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

	public async save_account(nsec: string, password = "") {
		try {
			const cmd: string = await invoke("save_key", {
				nsec,
				password,
			});

			return cmd;
		} catch (e) {
			throw new Error(String(e));
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
			throw new Error(String(e));
		}
	}

	public async get_relays() {
		try {
			const cmd: Relays = await invoke("get_relays");
			return cmd;
		} catch (e) {
			console.error(String(e));
			return null;
		}
	}

	public async add_relay(url: string) {
		try {
			const relayUrl = new URL(url);

			if (relayUrl.protocol === "wss:" || relayUrl.protocol === "ws:") {
				const cmd: boolean = await invoke("connect_relay", { relay: relayUrl });
				return cmd;
			}
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async remove_relay(url: string) {
		try {
			const relayUrl = new URL(url);

			if (relayUrl.protocol === "wss:" || relayUrl.protocol === "ws:") {
				const cmd: boolean = await invoke("remove_relay", { relay: relayUrl });
				return cmd;
			}
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async get_activities(account: string, kind: "1" | "6" | "9735" = "1") {
		try {
			const events: Event[] = await invoke("get_activities", { account, kind });
			return events;
		} catch (e) {
			console.error(String(e));
			return null;
		}
	}

	public async get_event(id: string) {
		try {
			const eventId: string = id.replace("nostr:", "").replace(/[^\w\s]/gi, "");
			const cmd: string = await invoke("get_event", { id: eventId });
			const event: Event = JSON.parse(cmd);
			return event;
		} catch (e) {
			console.error(id, String(e));
			throw new Error(String(e));
		}
	}

	public async get_events_from(pubkey: string, limit: number, asOf?: number) {
		try {
			let until: string = undefined;
			if (asOf && asOf > 0) until = asOf.toString();

			const nostrEvents: Event[] = await invoke("get_events_from", {
				publicKey: pubkey,
				limit,
				as_of: until,
			});

			return nostrEvents.sort((a, b) => b.created_at - a.created_at);
		} catch (e) {
			console.error(String(e));
			return [];
		}
	}

	public async search(content: string, limit: number) {
		try {
			if (content.length < 1) return [];

			const events: Event[] = await invoke("search", {
				content: content.trim(),
				limit,
			});

			return events;
		} catch (e) {
			console.info(String(e));
			return [];
		}
	}

	public async get_events(
		limit: number,
		asOf?: number,
		contacts?: string[],
		global?: boolean,
	) {
		try {
			let until: string = undefined;
			const isGlobal = global ?? false;

			if (asOf && asOf > 0) until = asOf.toString();

			const seenIds = new Set<string>();
			const nostrEvents: Event[] = await invoke("get_events", {
				limit,
				until,
				contacts,
				global: isGlobal,
			});

			// remove duplicate event
			for (const event of nostrEvents) {
				if (event.kind === Kind.Repost) {
					const repostId = event.tags.find((tag) => tag[0] === "e")?.[1];
					seenIds.add(repostId);
				}

				const eventIds = event.tags
					.filter((el) => el[0] === "e")
					?.map((item) => item[1]);

				if (eventIds?.length) {
					for (const id of eventIds) {
						seenIds.add(id);
					}
				}
			}

			const events = nostrEvents
				.filter((event) => !seenIds.has(event.id))
				.sort((a, b) => b.created_at - a.created_at);

			if (this.settings?.nsfw) {
				return events.filter(
					(event) =>
						event.tags.filter((event) => event[0] === "content-warning")
							.length > 0,
				);
			}

			return events;
		} catch (e) {
			console.info(String(e));
			return [];
		}
	}

	public async get_events_from_interests(
		hashtags: string[],
		limit: number,
		asOf?: number,
	) {
		let until: string = undefined;
		if (asOf && asOf > 0) until = asOf.toString();

		const seenIds = new Set<string>();
		const dedupQueue = new Set<string>();
		const nostrTags = hashtags.map((tag) => tag.replace("#", "").toLowerCase());

		const nostrEvents: Event[] = await invoke("get_events_from_interests", {
			hashtags: nostrTags,
			limit,
			until,
		});

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

	public async publish(
		content: string,
		reply_to?: string,
		quote?: boolean,
		nsfw?: boolean,
	) {
		try {
			const g = await generateContentTags(content);

			const eventContent = g.content;
			const eventTags = g.tags;

			if (reply_to) {
				const replyEvent = await this.get_event(reply_to);
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

			if (nsfw) {
				eventTags.push(["L", "content-warning"]);
				eventTags.push(["l", "reason", "content-warning"]);
				eventTags.push(["content-warning", "nsfw"]);
			}

			const cmd: string = await invoke("publish", {
				content: eventContent,
				tags: eventTags,
			});

			return cmd;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async reply_to(content: string, tags: string[]) {
		try {
			const cmd: string = await invoke("reply_to", { content, tags });
			return cmd;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async repost(id: string, author: string) {
		try {
			const cmd: string = await invoke("repost", { id, pubkey: author });
			return cmd;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async upvote(id: string, author: string) {
		try {
			const cmd: string = await invoke("upvote", { id, pubkey: author });
			return cmd;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async downvote(id: string, author: string) {
		try {
			const cmd: string = await invoke("downvote", { id, pubkey: author });
			return cmd;
		} catch (e) {
			throw new Error(String(e));
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

	public parse_event_thread(tags: string[][]) {
		let root: string = null;
		let reply: string = null;

		// Get all event references from tags, ignore mention
		const events = tags.filter((el) => el[0] === "e" && el[3] !== "mention");

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

	public async get_profile(pubkey: string) {
		try {
			const id = pubkey.replace("nostr:", "").replace(/[^\w\s]/gi, "");
			const cmd: Metadata = await invoke("get_profile", { id });

			return cmd;
		} catch (e) {
			console.error(pubkey, String(e));
			return null;
		}
	}

	public async get_current_user_profile() {
		try {
			const cmd: Metadata = await invoke("get_current_user_profile");
			return cmd;
		} catch {
			return null;
		}
	}

	public async create_profile(profile: Metadata) {
		try {
			const event: string = await invoke("create_profile", {
				name: profile.name || "",
				display_name: profile.display_name || "",
				displayName: profile.display_name || "",
				about: profile.about || "",
				picture: profile.picture || "",
				banner: profile.banner || "",
				nip05: profile.nip05 || "",
				lud16: profile.lud16 || "",
				website: profile.website || "",
			});
			return event;
		} catch (e) {
			throw new Error(String(e));
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
			throw new Error(String(e));
		}
	}

	public async unfollow(id: string) {
		try {
			const cmd: string = await invoke("unfollow", { id });
			return cmd;
		} catch (e) {
			throw new Error(String(e));
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
			throw new Error(String(e));
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

	public async set_nwc(uri: string) {
		try {
			const cmd: boolean = await invoke("set_nwc", { uri });
			return cmd;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async load_nwc() {
		try {
			const cmd: boolean = await invoke("load_nwc");
			return cmd;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async get_balance() {
		try {
			const cmd: number = await invoke("get_balance");
			return cmd;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async zap_profile(id: string, amount: number, message: string) {
		try {
			const cmd: boolean = await invoke("zap_profile", { id, amount, message });
			return cmd;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async zap_event(id: string, amount: number, message: string) {
		try {
			const cmd: boolean = await invoke("zap_event", { id, amount, message });
			return cmd;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async upload(filePath?: string) {
		const allowExts = [
			"png",
			"jpeg",
			"jpg",
			"gif",
			"mp4",
			"mp3",
			"webm",
			"mkv",
			"avi",
			"mov",
		];

		const selected =
			filePath ||
			(
				await open({
					multiple: false,
					filters: [
						{
							name: "Media",
							extensions: allowExts,
						},
					],
				})
			).path;

		// User cancelled action
		if (!selected) return null;

		try {
			const file = await readFile(selected);
			const blob = new Blob([file]);

			const data = new FormData();
			data.append("fileToUpload", blob);
			data.append("submit", "Upload Image");

			const res = await fetch("https://nostr.build/api/v2/upload/files", {
				method: "POST",
				body: data,
			});

			if (!res.ok) return null;

			const json = await res.json();
			const content = json.data[0];

			return content.url as string;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async get_columns() {
		try {
			const cmd: string = await invoke("get_nstore", {
				key: NSTORE_KEYS.columns,
			});
			const columns: LumeColumn[] = cmd ? JSON.parse(cmd) : [];
			return columns;
		} catch {
			return [];
		}
	}

	public async set_columns(columns: LumeColumn[]) {
		try {
			const cmd: string = await invoke("set_nstore", {
				key: NSTORE_KEYS.columns,
				content: JSON.stringify(columns),
			});
			return cmd;
		} catch (e) {
			throw new Error(e);
		}
	}

	public async get_settings() {
		try {
			if (this.settings) return this.settings;

			const cmd: string = await invoke("get_nstore", {
				key: NSTORE_KEYS.settings,
			});
			const settings: Settings = cmd ? JSON.parse(cmd) : null;

			this.settings = settings;

			return settings;
		} catch {
			const defaultSettings: Settings = {
				autoUpdate: false,
				enhancedPrivacy: false,
				notification: false,
				zap: false,
				nsfw: false,
			};
			this.settings = defaultSettings;
			return defaultSettings;
		}
	}

	public async set_settings(settings: Settings) {
		try {
			const cmd: string = await invoke("set_nstore", {
				key: NSTORE_KEYS.settings,
				content: JSON.stringify(settings),
			});
			return cmd;
		} catch (e) {
			throw new Error(e);
		}
	}

	public async get_interest() {
		try {
			const cmd: string = await invoke("get_nstore", {
				key: NSTORE_KEYS.interests,
			});
			const interests: Interests = cmd ? JSON.parse(cmd) : null;
			return interests;
		} catch {
			return null;
		}
	}

	public async set_interest(
		words: string[],
		users: string[],
		hashtags: string[],
	) {
		try {
			const interests: Interests = {
				words: words ?? [],
				users: users ?? [],
				hashtags: hashtags ?? [],
			};
			const cmd: string = await invoke("set_nstore", {
				key: NSTORE_KEYS.interests,
				content: JSON.stringify(interests),
			});
			return cmd;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async get_nstore(key: string) {
		try {
			const cmd: string = await invoke("get_nstore", {
				key,
			});
			const parse: string | string[] = cmd ? JSON.parse(cmd) : null;
			if (!parse.length) return null;
			return parse;
		} catch {
			return null;
		}
	}

	public async set_nstore(key: string, content: string) {
		try {
			const cmd: string = await invoke("set_nstore", {
				key,
				content,
			});
			return cmd;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async open_event_id(id: string) {
		try {
			const label = `event-${id}`;
			const url = `/events/${id}`;

			await invoke("open_window", {
				label,
				title: "Thread",
				url,
				width: 500,
				height: 800,
			});
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async open_event(event: Event) {
		try {
			let root: string = undefined;
			let reply: string = undefined;

			const eTags = event.tags.filter(
				(tag) => tag[0] === "e" || tag[0] === "q",
			);

			root = eTags.find((el) => el[3] === "root")?.[1];
			reply = eTags.find((el) => el[3] === "reply")?.[1];

			if (!root) root = eTags[0]?.[1];
			if (!reply) reply = eTags[1]?.[1];

			const label = `event-${event.id}`;
			const url = `/events/${root ?? reply ?? event.id}`;

			await invoke("open_window", {
				label,
				title: "Thread",
				url,
				width: 500,
				height: 800,
			});
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async open_profile(pubkey: string) {
		try {
			const label = `user-${pubkey}`;
			await invoke("open_window", {
				label,
				title: "Profile",
				url: `/users/${pubkey}`,
				width: 500,
				height: 800,
			});
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async open_editor(reply_to?: string, quote = false) {
		try {
			let url: string;

			if (reply_to) {
				url = `/editor?reply_to=${reply_to}&quote=${quote}`;
			} else {
				url = "/editor";
			}

			const label = `editor-${reply_to ? reply_to : 0}`;

			await invoke("open_window", {
				label,
				title: "Editor",
				url,
				width: 560,
				height: 340,
			});
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async open_nwc() {
		try {
			const label = "nwc";
			await invoke("open_window", {
				label,
				title: "Nostr Wallet Connect",
				url: "/nwc",
				width: 400,
				height: 600,
			});
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async open_zap(id: string, pubkey: string, account: string) {
		try {
			const label = `zap-${id}`;
			await invoke("open_window", {
				label,
				title: "Zap",
				url: `/zap/${id}?pubkey=${pubkey}&account=${account}`,
				width: 400,
				height: 500,
			});
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async open_settings() {
		try {
			const label = "settings";
			await invoke("open_window", {
				label,
				title: "Settings",
				url: "/settings",
				width: 800,
				height: 500,
			});
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async open_search() {
		try {
			const label = "search";
			await invoke("open_window", {
				label,
				title: "Search",
				url: "/search",
				width: 400,
				height: 600,
			});
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async open_activity(account: string) {
		try {
			const label = "activity";
			await invoke("open_window", {
				label,
				title: "Activity",
				url: `/activity/${account}/texts`,
				width: 400,
				height: 600,
			});
		} catch (e) {
			throw new Error(String(e));
		}
	}
}
