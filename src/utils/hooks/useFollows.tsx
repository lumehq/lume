import { useAccount } from "./useAccount";
import { RelayContext } from "@shared/relayProvider";
import { useQuery } from "@tanstack/react-query";
import { nip02ToArray } from "@utils/transform";
import { useContext } from "react";

export function useFollows() {
	const ndk = useContext(RelayContext);
	const { account } = useAccount();
	const { status, data: follows } = useQuery(
		["follows", account.pubkey],
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

	return { status, follows };
}
