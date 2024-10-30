import { commands } from "@/commands.gen";
import type { LumeColumn, NostrEvent } from "@/types";
import { Window, getCurrentWindow } from "@tauri-apps/api/window";
import { nanoid } from "nanoid";
import type { LumeEvent } from "./event";

export const LumeWindow = {
	openColumn: async (column: LumeColumn) => {
		await getCurrentWindow().emit("columns", {
			type: "add",
			column,
		});
	},
	openLaunchpad: async (account: string) => {
		await getCurrentWindow().emit("columns", {
			type: "add",
			column: {
				label: `launchpad-${account.slice(0, 5)}`,
				name: "Launchpad",
				url: `/columns/launchpad/${account}`,
				account,
			},
		});
	},
	openNewsfeed: async (account: string) => {
		await getCurrentWindow().emit("columns", {
			type: "add",
			column: {
				label: "newsfeed",
				name: "Newsfeed",
				url: `/columns/newsfeed/${account}`,
				account,
			},
		});
	},
	openStory: async (account: string) => {
		await getCurrentWindow().emit("columns", {
			type: "add",
			column: {
				label: "stories",
				name: "Stories",
				url: `/columns/stories/${account}`,
				account,
			},
		});
	},
	openNotification: async (account: string) => {
		await getCurrentWindow().emit("columns", {
			type: "add",
			column: {
				label: "notification",
				name: "Notification",
				url: `/columns/notification/${account}`,
				account,
			},
		});
	},
	openSearch: async () => {
		await getCurrentWindow().emit("columns", {
			type: "add",
			column: {
				label: "search",
				name: "Search",
				url: "/columns/search",
			},
		});
	},
	openEvent: async (event: NostrEvent | LumeEvent) => {
		const eTags = event.tags.filter((tag) => tag[0] === "e" || tag[0] === "q");
		const root: string =
			eTags.find((el) => el[3] === "root")?.[1] ?? eTags[0]?.[1];
		const reply: string =
			eTags.find((el) => el[3] === "reply")?.[1] ?? eTags[1]?.[1];

		const url = `/columns/events/${root ?? reply ?? event.id}`;
		const label = `event-${root?.substring(0, 6) ?? reply?.substring(0, 6) ?? event.id.substring(0, 6)}`;

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
	openHashtag: async (hashtag: string) => {
		const content = hashtag.replace("#", "");
		const label = `hashtag-${content}`;

		LumeWindow.openColumn({
			label,
			url: `/columns/hashtags/${content}`,
			name: hashtag,
		});
	},
	openEditor: async (reply_to?: string, quote?: string) => {
		const label = `editor-${reply_to ? reply_to : 0}`;
		const url = reply_to
			? `/new-post?reply_to=${reply_to}`
			: quote?.length
				? `/new-post?quote=${quote}`
				: "/new-post";
		const query = await commands.openWindow({
			label,
			url,
			title: "New Post",
			width: 560,
			height: 340,
			maximizable: false,
			minimizable: false,
			hidden_title: true,
			closable: true,
		});

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	openZap: async (id: string, account?: string) => {
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
				closable: true,
			});
		} else if (account) {
			await LumeWindow.openSettings(account, "wallet");
		}
	},
	openSettings: async (account: string, path?: string) => {
		const query = await commands.openWindow({
			label: "settings",
			url: path
				? `/settings/${account}/${path}`
				: `/settings/${account}/general`,
			title: "Settings",
			width: 700,
			height: 500,
			maximizable: false,
			minimizable: false,
			hidden_title: true,
			closable: true,
		});

		if (query.status === "ok") {
			return query.data;
		} else {
			throw new Error(query.error);
		}
	},
	openPopup: async (url: string, title?: string, closable = true) => {
		const query = await commands.openWindow({
			label: `popup-${nanoid()}`,
			url,
			title: title ?? "",
			width: 360,
			height: 460,
			maximizable: false,
			minimizable: false,
			hidden_title: !!title,
			closable,
		});

		if (query.status === "ok") {
			return await Window.getByLabel(query.data);
		} else {
			throw new Error(query.error);
		}
	},
};
