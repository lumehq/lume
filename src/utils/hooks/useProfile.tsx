import { RelayContext } from "@shared/relayProvider";
import { METADATA_RELAY } from "@stores/constants";
import { createPleb, getPleb } from "@utils/storage";
import { nip19 } from "nostr-tools";
import { useContext } from "react";
import useSWR from "swr";
import useSWRSubscription from "swr/subscription";

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
		return null;
	}
};

export function useProfile(key: string) {
	const pool: any = useContext(RelayContext);

	const {
		data: cache,
		error,
		isLoading,
	} = useSWR(key, fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
	});

	const { data: newest } = useSWRSubscription(
		cache ? null : key,
		(_, { next }) => {
			const unsubscribe = pool.subscribe(
				[
					{
						authors: [key],
						kinds: [0],
					},
				],
				METADATA_RELAY,
				(event: { content: string }) => {
					const content = JSON.parse(event.content);
					// update state
					next(null, content);
					// save to database
					createPleb(key, event);
				},
				undefined,
				undefined,
				{
					unsubscribeOnEose: true,
				},
			);

			return () => {
				unsubscribe();
			};
		},
	);

	return {
		user: newest ? newest : cache,
		isLoading,
		isError: error,
	};
}
