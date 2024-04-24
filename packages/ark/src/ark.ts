import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import type {
	Account,
	Contact,
	Event,
	EventWithReplies,
	Interests,
	Keys,
	LumeColumn,
	Metadata,
	Settings,
} from "@lume/types";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { generateContentTags } from "@lume/utils";

enum NSTORE_KEYS {
	settings = "lume_user_settings",
	interests = "lume_user_interests",
	columns = "lume_user_columns",
}

export class Ark {
	public windows: WebviewWindow[];
	public settings: Settings;

	constructor() {
		this.windows = [];
		this.settings = undefined;
	}

	public async get_all_accounts() {
		try {
			const accounts: Account[] = [];
			const cmd: string[] = await invoke("get_accounts");

			if (cmd) {
				for (const item of cmd) {
					accounts.push({ npub: item.replace(".npub", "") });
				}
				return accounts;
			}
		} catch {
			return [];
		}
	}

	public async load_selected_account(npub: string) {
		try {
			const cmd: boolean = await invoke("load_selected_account", {
				npub,
			});
			await invoke("connect_user_relays");

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

	public async save_account(nsec: string, password: string = "") {
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

	public async get_event(id: string) {
		try {
			const eventId: string = id.replace("nostr:", "").replace(/[^\w\s]/gi, "");
			const cmd: string = await invoke("get_event", { id: eventId });
			const event: Event = JSON.parse(cmd);
			return event;
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public async get_events_from(pubkey: string, limit: number, asOf?: number) {
		try {
			let until: string = undefined;
			if (asOf && asOf > 0) until = asOf.toString();

			const nostrEvents: Event[] = await invoke("get_events_from", {
				public_key: pubkey,
				limit,
				as_of: until,
			});

			return nostrEvents.sort((a, b) => b.created_at - a.created_at);
		} catch {
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
			let isGlobal = global ?? false;

			if (asOf && asOf > 0) until = asOf.toString();

			const seenIds = new Set<string>();
			const dedupQueue = new Set<string>();

			const nostrEvents: Event[] = await invoke("get_events", {
				limit,
				until,
				contacts,
				global: isGlobal,
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

			const events = nostrEvents
				.filter((event) => !dedupQueue.has(event.id))
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
			const id = pubkey.replace("nostr:", "").replace(/[^\w\s]/gi, "");
			const cmd: Metadata = await invoke("get_profile", { id });

			return cmd;
		} catch {
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

	public async get_contact_metadata() {
		try {
			const cmd: Contact[] = await invoke("get_contact_metadata");
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
		try {
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

			if (!selected) return null;

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

	public open_thread(id: string) {
		try {
			const window = new WebviewWindow(`event-${id}`, {
				title: "Thread",
				url: `/events/${id}`,
				minWidth: 500,
				minHeight: 800,
				width: 500,
				height: 800,
				titleBarStyle: "overlay",
				center: false,
			});

			this.windows.push(window);
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public open_profile(pubkey: string) {
		try {
			const window = new WebviewWindow(`user-${pubkey}`, {
				title: "Profile",
				url: `/users/${pubkey}`,
				minWidth: 500,
				minHeight: 800,
				width: 500,
				height: 800,
				titleBarStyle: "overlay",
			});

			this.windows.push(window);
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public open_editor(reply_to?: string, quote: boolean = false) {
		try {
			let url: string;

			if (reply_to) {
				url = `/editor?reply_to=${reply_to}&quote=${quote}`;
			} else {
				url = "/editor";
			}

			const window = new WebviewWindow(`editor-${reply_to ? reply_to : 0}`, {
				title: "Editor",
				url,
				minWidth: 500,
				minHeight: 400,
				width: 600,
				height: 400,
				hiddenTitle: true,
				titleBarStyle: "overlay",
			});

			this.windows.push(window);
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public open_nwc() {
		try {
			const window = new WebviewWindow("nwc", {
				title: "Nostr Wallet Connect",
				url: "/nwc",
				minWidth: 400,
				minHeight: 600,
				width: 400,
				height: 600,
				hiddenTitle: true,
				titleBarStyle: "overlay",
			});

			this.windows.push(window);
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public open_zap(id: string, pubkey: string, account: string) {
		try {
			const window = new WebviewWindow(`zap-${id}`, {
				title: "Zap",
				url: `/zap/${id}?pubkey=${pubkey}&account=${account}`,
				minWidth: 400,
				minHeight: 500,
				width: 400,
				height: 500,
				titleBarStyle: "overlay",
			});

			this.windows.push(window);
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public open_settings() {
		try {
			const window = new WebviewWindow("settings", {
				title: "Settings",
				url: "/settings",
				minWidth: 600,
				minHeight: 500,
				width: 800,
				height: 500,
				titleBarStyle: "overlay",
			});

			this.windows.push(window);
		} catch (e) {
			throw new Error(String(e));
		}
	}

	public open_search() {
		try {
			const window = new WebviewWindow("search", {
				title: "Search",
				url: "/search",
				width: 750,
				height: 470,
				minimizable: false,
				resizable: false,
				titleBarStyle: "overlay",
			});

			this.windows.push(window);
		} catch (e) {
			throw new Error(String(e));
		}
	}
}
