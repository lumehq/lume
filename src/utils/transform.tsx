import { NDKTag } from "@nostr-dev-kit/ndk";
import destr from "destr";
import { nip19 } from "nostr-tools";

export function truncateContent(str, n) {
	return str.length > n ? `${str.slice(0, n - 1)}...` : str;
}

export function setToArray(tags: any) {
	const newArray = [];
	tags.forEach((item) => {
		const hexpubkey = nip19.decode(item.npub).data;
		newArray.push(hexpubkey);
	});

	return newArray;
}

// convert NIP-02 to array of pubkey
export function nip02ToArray(tags: any) {
	const arr = [];
	tags.forEach((item) => {
		arr.push(item[1]);
	});

	return arr;
}

// convert array to NIP-02 tag list
export function arrayToNIP02(arr: string[]) {
	const nip02_arr = [];
	arr.forEach((item) => {
		nip02_arr.push(["p", item]);
	});

	return nip02_arr;
}

// convert array object to pure array
export function arrayObjToPureArr(arr: any) {
	const pure_arr = [];
	arr.forEach((item) => {
		pure_arr.push(item.content);
	});

	return pure_arr;
}

// get parent id from event tags
export function getParentID(arr: string[], fallback: string) {
	const tags = destr(arr);
	let parentID = fallback;

	if (tags.length > 0) {
		if (tags[0][0] === "e") {
			parentID = tags[0][1];
		} else {
			tags.forEach((tag) => {
				if (tag[0] === "e" && (tag[2] === "root" || tag[3] === "root")) {
					parentID = tag[1];
				}
			});
		}
	}

	return parentID;
}

// check id present in event tags
export function isTagsIncludeID(id: string, arr: NDKTag[]) {
	const tags = destr(arr);

	if (tags.length > 0) {
		if (tags[0][1] === id) {
			return true;
		}
	} else {
		return false;
	}
}

// get parent id from event tags
export function getQuoteID(arr: NDKTag[]) {
	const tags = destr(arr);
	let quoteID = null;

	if (tags.length > 0) {
		if (tags[0][0] === "e") {
			quoteID = tags[0][1];
		} else {
			quoteID = tags.find((t) => t[0] === "e")?.[1];
		}
	}

	return quoteID;
}

// sort events by timestamp
export function sortEvents(arr: any) {
	arr.sort((a, b) => {
		return a.created_at - b.created_at;
	});

	return arr;
}
