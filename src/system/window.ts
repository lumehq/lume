import { commands } from "@/commands.gen";
import type { LumeColumn, NostrEvent } from "@/types";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { LumeEvent } from "./event";

export const LumeWindow = {
	openColumn: async (column: LumeColumn) => {
		await getCurrentWindow().emit("columns", {
			type: "add",
			column,
		});
	},
	openEvent: async (event: NostrEvent | LumeEvent) => {
		const eTags = event.tags.filter((tag) => tag[0] === "e" || tag[0] === "q");
		const root: string =
			eTags.find((el) => el[3] === "root")?.[1] ?? eTags[0]?.[1];
		const reply: string =
			eTags.find((el) => el[3] === "reply")?.[1] ?? eTags[1]?.[1];

		const url = `/columns/events/${root ?? reply ?? event.id}`;
		const label = `event-${root ?? reply ?? event.id}`;

		LumeWindow.openColumn({ label, url, name: "Thread" });
	},
	openProfile: async (pubkey: string) => {
		const label = `user-${pubkey}`;

		LumeWindow.openColumn({
			label,
			url: `/columns/users/${pubkey}`,
			name: "Profile",
		});
	},
	openEditor: async (reply_to?: string, quote?: string) => {
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
			maximizable: false,
			minimizable: false,
			hidden_title: true,
		});

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	openZap: async (id: string) => {
		const wallet = await commands.loadWallet();

		if (wallet.status === "ok") {
			await commands.openWindow({
				label: `zap-${id}`,
				url: `/zap/${id}`,
				title: "Zap",
				width: 360,
				height: 460,
				maximizable: false,
				minimizable: false,
				hidden_title: true,
			});
		} else {
			await LumeWindow.openSettings("bitcoin-connect");
		}
	},
	openSettings: async (path?: string) => {
		const label = "settings";
		const query = await commands.openWindow({
			label,
			url: path ? `/settings/${path}` : "/settings/general",
			title: "Settings",
			width: 800,
			height: 500,
			maximizable: false,
			minimizable: false,
			hidden_title: true,
		});

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	openSearch: async (searchType: "notes" | "users", searchQuery: string) => {
		const url = `/search/${searchType}?query=${searchQuery}`;
		const label = `search-${searchQuery
			.toLowerCase()
			.replace(/[^\w ]+/g, "")
			.replace(/ +/g, "_")
			.replace(/_+/g, "_")}`;

		const query = await commands.openWindow({
			label,
			url,
			title: "Search",
			width: 400,
			height: 600,
			maximizable: false,
			minimizable: false,
			hidden_title: true,
		});

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	openMainWindow: async () => {
		const query = await commands.reopenLume();
		return query;
	},
};
