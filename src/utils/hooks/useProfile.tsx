import { createPleb, getPleb } from "@libs/storage";
import { RelayContext } from "@shared/relayProvider";
import { useQuery } from "@tanstack/react-query";
import { nip19 } from "nostr-tools";
import { useContext } from "react";

export function useProfile(id: string) {
	const ndk = useContext(RelayContext);
	const {
		status,
		data: user,
		error,
		isFetching,
	} = useQuery(["user", id], async () => {
		let npub: string;

		if (id.substring(0, 4) === "npub") {
			npub = id;
		} else {
			npub = nip19.npubEncode(id);
		}

		const current = Math.floor(Date.now() / 1000);
		const result = await getPleb(npub);

		if (result && parseInt(result.created_at) + 86400 >= current) {
			console.log("cache", result);
			return result;
		} else {
			const user = ndk.getUser({ npub });
			await user.fetchProfile();
			console.log("new", user);
			await createPleb(id, user.profile);

			return user.profile;
		}
	});

	return { status, user, error, isFetching };
}
