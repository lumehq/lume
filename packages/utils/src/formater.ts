import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { nip19 } from "nostr-tools";
import { AUDIOS, IMAGES, VIDEOS } from "./constants";
import { BitcoinUnit } from "bitcoin-units";

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
	const npub = pubkey.startsWith("npub1")
		? pubkey
		: (nip19.npubEncode(pubkey) as string);
	if (npub.length <= len) return npub;

	const separator = " ... ";

	const sepLen = separator.length;
	const charsToShow = len - sepLen;
	const frontChars = Math.ceil(charsToShow / 2);
	const backChars = Math.floor(charsToShow / 2);

	return (
		npub.substr(0, frontChars) +
		separator +
		npub.substr(npub.length - backChars)
	);
}

export function displayLongHandle(str: string) {
	const split = str.split("@");
	const handle = split[0];
	const service = split[1];

	return handle.substring(0, 16) + "..." + "@" + service;
}

// convert number to K, M, B, T, etc.
export const compactNumber = Intl.NumberFormat("en", { notation: "compact" });

// country name
export const regionNames = new Intl.DisplayNames(["en"], { type: "language" });

// verify link can be preview
export function canPreview(text: string) {
	const url = new URL(text);
	const ext = url.pathname.split(".").pop();
	const hostname = url.hostname;

	if (VIDEOS.includes(ext)) return false;
	if (IMAGES.includes(ext)) return false;
	if (AUDIOS.includes(ext)) return false;

	if (hostname === "youtube.com") return false;
	if (hostname === "youtu.be") return false;
	if (hostname === "x.com") return false;
	if (hostname === "twitter.com") return false;
	if (hostname === "facebook.com") return false;
	if (hostname === "vimeo.com") return false;

	return true;
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
				res = " " + res;
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
