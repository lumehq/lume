import { NDKUser } from "@nostr-dev-kit/ndk";
import { RelayContext } from "@shared/relayProvider";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export function useProfile(pubkey: string, fallback?: string) {
	const ndk = useContext(RelayContext);
	const {
		status,
		data: user,
		error,
		isFetching,
	} = useQuery(
		["user", pubkey],
		async () => {
			if (fallback) {
				const profile = JSON.parse(fallback);
				return profile;
			} else {
				const user = ndk.getUser({ hexpubkey: pubkey });
				await user.fetchProfile();

				return user.profile;
			}
		},
		{
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		},
	);

	return { status, user, error, isFetching };
}
