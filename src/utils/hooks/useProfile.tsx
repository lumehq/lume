import { METADATA_SERVICE } from "@stores/constants";
import { createPleb, getPleb } from "@utils/storage";
import { nip19 } from "nostr-tools";
import useSWR from "swr";

const fetcher = async (key: string) => {
	let npub: string;

	if (key.substring(0, 4) === "npub") {
		npub = key;
	} else {
		npub = nip19.npubEncode(key);
	}

	const current = Math.floor(Date.now() / 1000);
	const result = await getPleb(npub);

	if (result && result.created_at + 86400 < current) {
		return result;
	} else {
		const res = await fetch(`${METADATA_SERVICE}/${key}/metadata.json`);

		if (!res.ok) {
			return null;
		}

		const json = await res.json();
		const saveToDB = await createPleb(key, json);

		if (saveToDB) {
			return JSON.parse(json.content);
		}
	}
};

export function useProfile(key: string) {
	const { data, error, isLoading } = useSWR(key, fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
	});

	return {
		user: data,
		isLoading,
		isError: error,
	};
}
