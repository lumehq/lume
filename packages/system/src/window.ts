import type { NostrEvent } from "@lume/types";
import { commands } from "./commands";
import type { LumeEvent } from "./event";

export class LumeWindow {
	static async openMainWindow() {
		const query = await commands.openMainWindow();
		return query;
	}

	static async openEvent(event: NostrEvent | LumeEvent) {
		const eTags = event.tags.filter((tag) => tag[0] === "e" || tag[0] === "q");
		const root: string =
			eTags.find((el) => el[3] === "root")?.[1] ?? eTags[0]?.[1];
		const reply: string =
			eTags.find((el) => el[3] === "reply")?.[1] ?? eTags[1]?.[1];

		const label = `event-${event.id}`;
		const url = `/events/${root ?? reply ?? event.id}`;

		const query = await commands.openWindow({
			label,
			url,
			title: "Thread",
			width: 500,
			height: 800,
			maximizable: true,
			minimizable: true,
		});

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async openProfile(pubkey: string) {
		const label = `user-${pubkey}`;
		const query = await commands.openWindow({
			label,
			url: `/users/${pubkey}`,
			title: "Profile",
			width: 500,
			height: 800,
			maximizable: true,
			minimizable: true,
		});

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async openEditor(reply_to?: string, quote?: string) {
		let url: string;

		if (reply_to) {
			url = `/editor?reply_to=${reply_to}`;
		}

		if (quote?.length) {
			url = `/editor?quote=${quote}`;
		}

		if (!reply_to?.length && !quote?.length) {
			url = "/editor";
		}

		const label = `editor-${reply_to ? reply_to : 0}`;
		const query = await commands.openWindow({
			label,
			url,
			title: "Editor",
			width: 560,
			height: 340,
			maximizable: true,
			minimizable: false,
		});

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async openZap(id: string) {
		const wallet = await commands.loadWallet();

		if (wallet.status === "ok") {
			await commands.openWindow({
				label: `zap-${id}`,
				url: `/zap/${id}`,
				title: "Zap",
				width: 400,
				height: 500,
				maximizable: false,
				minimizable: false,
			});
		} else {
			await LumeWindow.openSettings("bitcoin-connect");
		}
	}

	static async openSettings(path?: string) {
		const label = "settings";
		const query = await commands.openWindow({
			label,
			url: path ? `/settings/${path}` : "/settings/general",
			title: "Settings",
			width: 800,
			height: 500,
			maximizable: false,
			minimizable: false,
		});

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}

	static async openSearch() {
		const label = "search";
		const query = await commands.openWindow({
			label,
			url: "/search",
			title: "Search",
			width: 400,
			height: 600,
			maximizable: false,
			minimizable: false,
		});

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	}
}
