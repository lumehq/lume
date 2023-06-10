import { createPleb, getPleb } from "@libs/storage";
import NDK from "@nostr-dev-kit/ndk";
import { RelayContext } from "@shared/relayProvider";
import { nip19 } from "nostr-tools";
import { useContext } from "react";
import useSWR from "swr";

const fetcher = async ([, ndk, key]) => {
	let npub: string;

	if (key.substring(0, 4) === "npub") {
		npub = key;
	} else {
		npub = nip19.npubEncode(key);
	}

	const current = Math.floor(Date.now() / 1000);
	const result = await getPleb(npub);

	if (result && result.created_at + 86400 > current) {
		return result;
	} else {
		const user = ndk.getUser({ npub });
		await user.fetchProfile();
		await createPleb(key, user.profile);

		return user.profile;
	}
};

export function useProfile(key: string) {
	const ndk = useContext(RelayContext);
	const { data, error, isLoading } = useSWR(["profile", ndk, key], fetcher, {
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
