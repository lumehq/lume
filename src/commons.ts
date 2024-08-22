import type {
	AsyncStorage,
	PersistedQuery,
} from "@tanstack/query-persist-client-core";
import { ask, message } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";
import { BitcoinUnit } from "bitcoin-units";
import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { type UseStore, del, get, set } from "idb-keyval";
import { decode } from "light-bolt11-decoder";
import { type BaseEditor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { twMerge } from "tailwind-merge";
import type { RichEvent } from "./commands.gen";
import { LumeEvent } from "./system";
import type { NostrEvent } from "./types";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
	relativeTime: {
		past: "%s ago",
		s: "just now",
		m: "1m",
		mm: "%dm",
		h: "1h",
		hh: "%dh",
		d: "1d",
		dd: "%dd",
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isImagePath = (path: string) => {
	for (const suffix of ["jpg", "jpeg", "gif", "png", "webp", "avif", "tiff"]) {
		if (path.endsWith(suffix)) return true;
	}
	return false;
};

export const isImageUrl = (url: string) => {
	try {
		if (!url) return false;
		const ext = new URL(url).pathname.split(".").pop();
		return ["jpg", "jpeg", "gif", "png", "webp", "avif", "tiff"].includes(ext);
	} catch {
		return false;
	}
};

export const insertImage = (editor: ReactEditor | BaseEditor, url: string) => {
	const text = { text: "" };
	const image = [
		{
			type: "image",
			url,
			children: [text],
		},
	];
	const extraText = [
		{
			type: "paragraph",
			children: [text],
		},
	];

	// @ts-ignore, idk
	ReactEditor.focus(editor);
	Transforms.insertNodes(editor, image);
	Transforms.insertNodes(editor, extraText);
};

export const insertNostrEvent = (
	editor: ReactEditor | BaseEditor,
	eventId: string,
) => {
	const text = { text: "" };
	const event = [
		{
			type: "event",
			eventId: `nostr:${eventId}`,
			children: [text],
		},
	];
	const extraText = [
		{
			type: "paragraph",
			children: [text],
		},
	];

	Transforms.insertNodes(editor, event);
	Transforms.insertNodes(editor, extraText);
};

export function formatCreatedAt(time: number, message = false) {
	let formated: string;

	const now = dayjs();
	const inputTime = dayjs.unix(time);
	const diff = now.diff(inputTime, "hour");

	if (message) {
		if (diff < 12) {
			formated = inputTime.format("HH:mm A");
		} else {
			formated = inputTime.format("MMM DD");
		}
	} else {
		if (diff < 24) {
			formated = inputTime.from(now, true);
		} else {
			formated = inputTime.format("MMM DD");
		}
	}

	return formated;
}

export function replyTime(time: number) {
	const inputTime = dayjs.unix(time);
	const formated = inputTime.format("MM-DD-YY HH:mm");

	return formated;
}

export function displayNsec(key: string, len: number) {
	if (key.length <= len) return key;

	const separator = " ... ";

	const sepLen = separator.length;
	const charsToShow = len - sepLen;
	const frontChars = Math.ceil(charsToShow / 2);
	const backChars = Math.floor(charsToShow / 2);

	return (
		key.substr(0, frontChars) + separator + key.substr(key.length - backChars)
	);
}

export function displayNpub(pubkey: string, len: number) {
	if (pubkey.length <= len) return pubkey;

	const separator = " ... ";

	const sepLen = separator.length;
	const charsToShow = len - sepLen;
	const frontChars = Math.ceil(charsToShow / 2);
	const backChars = Math.floor(charsToShow / 2);

	return (
		pubkey.substr(0, frontChars) +
		separator +
		pubkey.substr(pubkey.length - backChars)
	);
}

export function displayLongHandle(str: string) {
	const split = str.split("@");
	const handle = split[0];
	const service = split[1];

	return `${handle.substring(0, 16)}...@${service}`;
}

// source: https://github.com/synonymdev/bitkit/blob/master/src/utils/displayValues/index.ts
export function getBitcoinDisplayValues(satoshis: number) {
	let bitcoinFormatted = new BitcoinUnit(satoshis, "satoshis")
		.getValue()
		.toFixed(10)
		.replace(/\.?0+$/, "");

	const [bitcoinWhole, bitcoinDecimal] = bitcoinFormatted.split(".");

	// format sats to group thousands
	// 4000000 -> 4 000 000
	let res = "";
	bitcoinFormatted
		.split("")
		.reverse()
		.forEach((c, index) => {
			if (index > 0 && index % 3 === 0) {
				res = ` ${res}`;
			}
			res = c + res;
		});

	bitcoinFormatted = res;

	return {
		bitcoinFormatted,
		bitcoinWhole,
		bitcoinDecimal,
	};
}

export function decodeZapInvoice(tags?: string[][]) {
	const invoice = tags.find((tag) => tag[0] === "bolt11")?.[1];
	if (!invoice) return;

	const decodedInvoice = decode(invoice);
	const amountSection = decodedInvoice.sections.find(
		(s: { name: string }) => s.name === "amount",
	);

	const amount = Number.parseInt(amountSection.value);
	const displayValue = getBitcoinDisplayValues(amount);

	return displayValue;
}

export async function checkForAppUpdates(silent: boolean) {
	const update = await check();

	if (!update) {
		if (silent) return;

		await message("You are on the latest version. Stay awesome!", {
			title: "No Update Available",
			kind: "info",
			okLabel: "OK",
		});

		return;
	}

	if (update?.available) {
		const yes = await ask(
			`Update to ${update.version} is available!\n\nRelease notes: ${update.body}`,
			{
				title: "Update Available",
				kind: "info",
				okLabel: "Update",
				cancelLabel: "Cancel",
			},
		);

		if (yes) {
			await update.downloadAndInstall();
			await relaunch();
		}

		return;
	}
}

export function toLumeEvents(richEvents: RichEvent[]) {
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

export function newIdbStorage(
	idbStore: UseStore,
): AsyncStorage<PersistedQuery> {
	return {
		getItem: async (key) => await get(key, idbStore),
		setItem: async (key, value) => await set(key, value, idbStore),
		removeItem: async (key) => await del(key, idbStore),
	};
}
