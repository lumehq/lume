import type { LumeColumn, Metadata, NostrEvent, Relay } from "@lume/types";
import { resolveResource } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile, readTextFile } from "@tauri-apps/plugin-fs";
import { relaunch } from "@tauri-apps/plugin-process";
import { nip19 } from "nostr-tools";
import { type Result, type RichEvent, commands } from "./commands";
import { LumeEvent } from "./event";

export class NostrQuery {
	static #toLumeEvents(richEvents: RichEvent[]) {
		const events = richEvents.map((item) => {
			const nostrEvent: NostrEvent = JSON.parse(item.raw);

			if (item.parsed) {
				nostrEvent.meta = item.parsed;
			} else {
				nostrEvent.meta = null;
			}

			const lumeEvent = new LumeEvent(nostrEvent);

			return lumeEvent;
		});

		return events;
	}

	static async upload(filePath?: string) {
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

	static async getNotifications() {
		const query = await commands.getNotifications();

		if (query.status === "ok") {
			const data = query.data.map((item) => JSON.parse(item) as NostrEvent);
			const events = data.map((ev) => new LumeEvent(ev));

			return events;
		} else {
			console.error(query.error);
			return [];
		}
	}

	static async getProfile(pubkey: string) {
		const normalize = pubkey.replace("nostr:", "").replace(/[^\w\s]/gi, "");
		const query = await commands.getProfile(normalize);

		if (query.status === "ok") {
			const profile: Metadata = JSON.parse(query.data);
			return profile;
		} else {
			return null;
		}
	}

	static async getEvent(id: string, hint?: string) {
		// Validate ID
		const normalizeId: string = id
			.replace("nostr:", "")
			.replace(/[^\w\s]/gi, "");

		// Define query
		let query: Result<RichEvent, string>;
		let relayHint: string = hint;

		if (normalizeId.startsWith("nevent1")) {
			const decoded = nip19.decode(normalizeId);
			if (decoded.type === "nevent") relayHint = decoded.data.relays[0];
		}

		// Build query
		if (relayHint) {
			try {
				const url = new URL(relayHint);
				query = await commands.getEventFrom(normalizeId, url.toString());
			} catch {
				query = await commands.getEvent(normalizeId);
			}
		} else {
			query = await commands.getEvent(normalizeId);
		}

		if (query.status === "ok") {
			const data = query.data;
			const raw = JSON.parse(data.raw) as NostrEvent;

			if (data?.parsed) {
				raw.meta = data.parsed;
			}

			const event = new LumeEvent(raw);

			return event;
		} else {
			console.log("[getEvent]: ", query.error);
			return null;
		}
	}

	static async getRepostEvent(event: LumeEvent) {
		try {
			const embed: NostrEvent = JSON.parse(event.content);
			const query = await commands.getEventMeta(embed.content);

			if (query.status === "ok") {
				embed.meta = query.data;
				const lumeEvent = new LumeEvent(embed);
				return lumeEvent;
			}
		} catch {
			const query = await commands.getEvent(event.repostId);

			if (query.status === "ok") {
				const data = query.data;
				const raw = JSON.parse(data.raw) as NostrEvent;

				if (data?.parsed) {
					raw.meta = data.parsed;
				}

				const event = new LumeEvent(raw);

				return event;
			} else {
				console.log("[getRepostEvent]: ", query.error);
				return null;
			}
		}
	}

	static async getUserEvents(pubkey: string, asOf?: number) {
		const until: string = asOf && asOf > 0 ? asOf.toString() : undefined;
		const query = await commands.getEventsBy(pubkey, until);

		if (query.status === "ok") {
			const data = NostrQuery.#toLumeEvents(query.data);
			return data;
		} else {
			return [];
		}
	}

	static async getLocalEvents(asOf?: number) {
		const until: string = asOf && asOf > 0 ? asOf.toString() : undefined;
		const query = await commands.getLocalEvents(until);

		if (query.status === "ok") {
			const data = NostrQuery.#toLumeEvents(query.data);
			return data;
		} else {
			return [];
		}
	}

	static async getGroupEvents(pubkeys: string[], asOf?: number) {
		const until: string = asOf && asOf > 0 ? asOf.toString() : undefined;
		const query = await commands.getGroupEvents(pubkeys, until);

		if (query.status === "ok") {
			const data = NostrQuery.#toLumeEvents(query.data);
			return data;
		} else {
			return [];
		}
	}

	static async getGlobalEvents(asOf?: number) {
		const until: string = asOf && asOf > 0 ? asOf.toString() : undefined;
		const query = await commands.getGlobalEvents(until);

		if (query.status === "ok") {
			const data = NostrQuery.#toLumeEvents(query.data);
			return data;
		} else {
			return [];
		}
	}

	static async getHashtagEvents(hashtags: string[], asOf?: number) {
		const until: string = asOf && asOf > 0 ? asOf.toString() : undefined;
		const nostrTags = hashtags.map((tag) => tag.replace("#", ""));
		const query = await commands.getHashtagEvents(nostrTags, until);

		if (query.status === "ok") {
			const data = NostrQuery.#toLumeEvents(query.data);
			return data;
		} else {
			return [];
		}
	}

	static async searchEvent(searchQuery: string, asOf?: number) {
		const until: string = asOf && asOf > 0 ? asOf.toString() : undefined;
		const query = await commands.searchEvent(until, searchQuery);

		if (query.status === "ok") {
			const data = NostrQuery.#toLumeEvents(query.data);
			return data;
		} else {
			return [];
		}
	}

	static async searchUser(searchQuery: string, asOf?: number) {
		const until: string = asOf && asOf > 0 ? asOf.toString() : undefined;
		const query = await commands.searchUser(until, searchQuery);

		if (query.status === "ok") {
			const events: NostrEvent[] = query.data.map((item) => JSON.parse(item));
			const meta: Metadata[] = events.map((event) => JSON.parse(event.content));
			return meta;
		} else {
			return [];
		}
	}

	static async verifyNip05(pubkey: string, nip05?: string) {
		const query = await commands.verifyNip05(pubkey, nip05);

		if (query.status === "ok") {
			return query.data;
		} else {
			return false;
		}
	}

	static async getNstore(key: string) {
		const query = await commands.getNstore(key);

		if (query.status === "ok") {
			const data = query.data ? JSON.parse(query.data) : null;
			return data;
		} else {
			return null;
		}
	}

	static async setNstore(key: string, value: string) {
		const query = await commands.setNstore(key, value);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async getUserSettings() {
		const query = await commands.getSettings();

		if (query.status === "ok") {
			return query.data;
		} else {
			return query.error;
		}
	}

	static async setUserSettings(newSettings: string) {
		const query = await commands.setNewSettings(newSettings);

		if (query.status === "ok") {
			return query.data;
		} else {
			return query.error;
		}
	}

	static async getColumns() {
		const key = "lume:columns";
		const systemPath = "resources/system_columns.json";
		const resourcePath = await resolveResource(systemPath);
		const resourceFile = await readTextFile(resourcePath);
		const systemColumns: LumeColumn[] = JSON.parse(resourceFile);
		const query = await commands.getNstore(key);

		try {
			if (query.status === "ok") {
				const columns: LumeColumn[] = JSON.parse(query.data);

				if (!columns?.length) {
					return systemColumns;
				}

				// Filter "open" column
				// Reason: deprecated
				return columns.filter((col) => col.label !== "open");
			} else {
				return systemColumns;
			}
		} catch {
			return systemColumns;
		}
	}

	static async setColumns(columns: LumeColumn[]) {
		const key = "lume:columns";
		const content = JSON.stringify(columns);
		const query = await commands.setNstore(key, content);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async getRelays() {
		const query = await commands.getRelays();

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async connectRelay(url: string) {
		const relayUrl = new URL(url);

		if (relayUrl.protocol === "wss:" || relayUrl.protocol === "ws:") {
			const query = await commands.connectRelay(relayUrl.toString());

			if (query.status === "ok") {
				return query.data;
			} else {
				throw new Error(query.error);
			}
		}
	}

	static async removeRelay(url: string) {
		const relayUrl = new URL(url);

		if (relayUrl.protocol === "wss:" || relayUrl.protocol === "ws:") {
			const query = await commands.removeRelay(relayUrl.toString());

			if (query.status === "ok") {
				return query.data;
			} else {
				throw new Error(query.error);
			}
		}
	}

	static async getBootstrapRelays() {
		const query = await commands.getBootstrapRelays();

		if (query.status === "ok") {
			const relays: Relay[] = [];

			for (const item of query.data) {
				const line = item.split(",");
				const url = line[0];
				const purpose = line[1] ?? "";

				relays.push({ url, purpose });
			}

			return relays;
		} else {
			return [];
		}
	}

	static async saveBootstrapRelays(relays: Relay[]) {
		const text = relays
			.map((relay) => Object.values(relay).join(","))
			.join("\n");
		const query = await commands.saveBootstrapRelays(text);

		if (query.status === "ok") {
			return await relaunch();
		} else {
			throw new Error(query.error);
		}
	}
}
