import { LumeColumn, Metadata, NostrEvent, Settings } from "@lume/types";
import { commands } from "./commands";
import { resolveResource } from "@tauri-apps/api/path";
import { readFile, readTextFile } from "@tauri-apps/plugin-fs";
import { isPermissionGranted } from "@tauri-apps/plugin-notification";
import { open } from "@tauri-apps/plugin-dialog";
import { dedupEvents } from "./dedup";
import { invoke } from "@tauri-apps/api/core";

enum NSTORE_KEYS {
	settings = "lume_user_settings",
	columns = "lume_user_columns",
}

export class NostrQuery {
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

	static async getEvent(id: string) {
		const normalize: string = id.replace("nostr:", "").replace(/[^\w\s]/gi, "");
		const query = await commands.getEvent(normalize);

		if (query.status === "ok") {
			const event: NostrEvent = JSON.parse(query.data);
			return event;
		} else {
			return null;
		}
	}

	static async getUserEvents(pubkey: string, asOf?: number) {
		const until: string = asOf && asOf > 0 ? asOf.toString() : undefined;
		const query = await commands.getEventsBy(pubkey, until);

		if (query.status === "ok") {
			const events = query.data.map((item) => JSON.parse(item) as NostrEvent);
			return events;
		} else {
			return [];
		}
	}

	static async getUserActivities(
		account: string,
		kind: "1" | "6" | "9735" = "1",
	) {
		const query = await commands.getActivities(account, kind);

		if (query.status === "ok") {
			const events = query.data.map((item) => JSON.parse(item) as NostrEvent);
			return events;
		} else {
			return [];
		}
	}

	static async getLocalEvents(pubkeys: string[], asOf?: number) {
		const until: string = asOf && asOf > 0 ? asOf.toString() : undefined;
		const query = await commands.getLocalEvents(pubkeys, until);

		if (query.status === "ok") {
			const events = query.data.map((item) => JSON.parse(item) as NostrEvent);
			const dedup = dedupEvents(events);

			return dedup;
		} else {
			return [];
		}
	}

	static async getGlobalEvents(asOf?: number) {
		const until: string = asOf && asOf > 0 ? asOf.toString() : undefined;
		const query = await commands.getGlobalEvents(until);

		if (query.status === "ok") {
			const events = query.data.map((item) => JSON.parse(item) as NostrEvent);
			const dedup = dedupEvents(events);

			return dedup;
		} else {
			return [];
		}
	}

	static async getHashtagEvents(hashtags: string[], asOf?: number) {
		const until: string = asOf && asOf > 0 ? asOf.toString() : undefined;
		const nostrTags = hashtags.map((tag) => tag.replace("#", ""));
		const query = await commands.getHashtagEvents(nostrTags, until);

		if (query.status === "ok") {
			const events = query.data.map((item) => JSON.parse(item) as NostrEvent);
			const dedup = dedupEvents(events);

			return dedup;
		} else {
			return [];
		}
	}

	static async verifyNip05(pubkey: string, nip05?: string) {
		if (!nip05) return false;

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
			const data: string | string[] = query.data
				? JSON.parse(query.data)
				: null;
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

	static async getSettings() {
		const query = await commands.getNstore(NSTORE_KEYS.settings);

		if (query.status === "ok") {
			const settings: Settings = query.data ? JSON.parse(query.data) : null;
			const isGranted = await isPermissionGranted();
			const theme: "auto" | "light" | "dark" = await invoke(
				"plugin:theme|get_theme",
			);

			return { ...settings, theme, notification: isGranted };
		} else {
			const initial: Settings = {
				autoUpdate: false,
				enhancedPrivacy: false,
				notification: false,
				zap: false,
				nsfw: false,
				gossip: false,
				theme: "auto",
			};

			return initial;
		}
	}

	static async setSettings(settings: Settings) {
		const query = await commands.setNstore(
			NSTORE_KEYS.settings,
			JSON.stringify(settings),
		);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async getColumns() {
		const query = await commands.getNstore(NSTORE_KEYS.columns);

		if (query.status === "ok") {
			const columns: LumeColumn[] = query.data ? JSON.parse(query.data) : [];

			if (columns.length < 1) {
				const systemPath = "resources/system_columns.json";
				const resourcePath = await resolveResource(systemPath);
				const resourceFile = await readTextFile(resourcePath);
				const systemColumns: LumeColumn[] = JSON.parse(resourceFile);

				return systemColumns;
			}

			return columns;
		} else {
			return [];
		}
	}

	static async setColumns(columns: LumeColumn[]) {
		const query = await commands.setNstore(
			NSTORE_KEYS.columns,
			JSON.stringify(columns),
		);

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
}
