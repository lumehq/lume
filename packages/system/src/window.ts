import { NostrEvent } from "@lume/types";
import { commands } from "./commands";

export class LumeWindow {
	static async openEvent(event: NostrEvent) {
		const eTags = event.tags.filter((tag) => tag[0] === "e" || tag[0] === "q");
		const root: string =
			eTags.find((el) => el[3] === "root")?.[1] ?? eTags[0]?.[1];
		const reply: string =
			eTags.find((el) => el[3] === "reply")?.[1] ?? eTags[1]?.[1];

		const label = `event-${event.id}`;
		const url = `/events/${root ?? reply ?? event.id}`;

		const query = await commands.openWindow(label, "Thread", url, 500, 800);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async openProfile(pubkey: string) {
		const label = `user-${pubkey}`;
		const query = await commands.openWindow(
			label,
			"Profile",
			`/users/${pubkey}`,
			500,
			800,
		);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async openEditor(reply_to?: string, quote = false) {
		let url: string;

		if (reply_to) {
			url = `/editor?reply_to=${reply_to}&quote=${quote}`;
		} else {
			url = "/editor";
		}

		const label = `editor-${reply_to ? reply_to : 0}`;
		const query = await commands.openWindow(label, "Editor", url, 560, 340);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async openZap(id: string, pubkey: string) {
		const nwc = await commands.loadNwc();

		if (nwc.status === "ok") {
			const status = nwc.data;

			if (!status) {
				const label = "nwc";
				await commands.openWindow(
					label,
					"Nostr Wallet Connect",
					"/nwc",
					400,
					600,
				);
			} else {
				const label = `zap-${id}`;
				await commands.openWindow(
					label,
					"Zap",
					`/zap/${id}?pubkey=${pubkey}`,
					400,
					500,
				);
			}
		} else {
			throw new Error(nwc.error);
		}
	}

	static async openSettings() {
		const label = "settings";
		const query = await commands.openWindow(
			label,
			"Settings",
			"/settings",
			800,
			500,
		);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async openSearch() {
		const label = "search";
		const query = await commands.openWindow(
			label,
			"Search",
			"/search",
			400,
			600,
		);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async openActivity(account: string) {
		const label = "activity";
		const query = await commands.openWindow(
			label,
			"Activity",
			`/activity/${account}/texts`,
			400,
			600,
		);

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}
}
