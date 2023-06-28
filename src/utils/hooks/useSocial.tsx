import { useAccount } from "./useAccount";
import { usePublish } from "@libs/ndk";
import { RelayContext } from "@shared/relayProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { nip02ToArray } from "@utils/transform";
import { useContext } from "react";

export function useSocial() {
	const ndk = useContext(RelayContext);
	const queryClient = useQueryClient();
	const publish = usePublish();

	const { account } = useAccount();
	const { status, data: userFollows } = useQuery(
		["userFollows", account.pubkey],
		async () => {
			const res = await ndk.fetchEvents({
				kinds: [3],
				authors: [account.pubkey],
			});
			const latest = [...res].slice(-1)[0];
			const list = nip02ToArray(latest.tags);
			return list;
		},
		{
			enabled: account ? true : false,
		},
	);

	const unfollow = (pubkey: string) => {
		const followsAsSet = new Set(userFollows);
		followsAsSet.delete(pubkey);

		const tags = [];
		followsAsSet.forEach((item) => {
			tags.push(["p", item]);
		});

		// publish event
		publish({ content: "", kind: 3, tags: tags });
		// invalid cache
		queryClient.invalidateQueries({
			queryKey: ["userFollows", account.pubkey],
		});
	};

	const follow = (pubkey: string) => {
		const followsAsSet = new Set(userFollows);
		followsAsSet.add(pubkey);

		const tags = [];
		followsAsSet.forEach((item) => {
			tags.push(["p", item]);
		});

		// publish event
		publish({ content: "", kind: 3, tags: tags });
		// invalid cache
		queryClient.invalidateQueries({
			queryKey: ["userFollows", account.pubkey],
		});
	};

	return { status, userFollows, follow, unfollow };
}
