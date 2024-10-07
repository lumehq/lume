import type {
	AsyncStorage,
	MaybePromise,
	PersistedQuery,
} from "@tanstack/query-persist-client-core";
import { Store } from "@tanstack/store";
import { ask, message, open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { relaunch } from "@tauri-apps/plugin-process";
import type { Store as TauriStore } from "@tauri-apps/plugin-store";
import { check } from "@tauri-apps/plugin-updater";
import { BitcoinUnit } from "bitcoin-units";
import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { decode } from "light-bolt11-decoder";
import { twMerge } from "tailwind-merge";
import type { RichEvent, Settings } from "./commands.gen";
import { LumeEvent } from "./system";
import type { LumeColumn, NostrEvent } from "./types";

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

export function displayNpub(pubkey: string, len: number) {
	if (pubkey.length <= len) return pubkey;

	const str = pubkey.replace("nostr:", "");
	const separator = " ... ";

	const sepLen = separator.length;
	const charsToShow = len - sepLen;
	const frontChars = Math.ceil(charsToShow / 2);
	const backChars = Math.floor(charsToShow / 2);

	return (
		str.substring(0, frontChars) +
		separator +
		str.substring(str.length - backChars)
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

	// @ts-ignore, its fine.
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

export async function upload(filePath?: string) {
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
		filePath ??
		(await open({
			multiple: false,
			filters: [
				{
					name: "Media",
					extensions: allowExts,
				},
			],
		}));

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

export function newQueryStorage(
	store: TauriStore,
): AsyncStorage<PersistedQuery> {
	return {
		getItem: async (key) => await store.get(key),
		setItem: async (key, value) => await store.set(key, value),
		removeItem: async (key) =>
			(await store.delete(key)) as unknown as MaybePromise<void>,
	};
}

export const appSettings = new Store<Settings>({
	proxy: null,
	image_resize_service: "https://wsrv.nl",
	use_relay_hint: true,
	content_warning: true,
	trusted_only: true,
	display_avatar: true,
	display_zap_button: true,
	display_repost_button: true,
	display_media: true,
	transparent: true,
});

export const appColumns = new Store<LumeColumn[]>([]);
