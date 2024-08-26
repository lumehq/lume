import { commands } from "@/commands.gen";
import type { Metadata } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { nip19 } from "nostr-tools";

export function useProfile(pubkey: string, embed?: string) {
	const {
		isLoading,
		isError,
		data: profile,
	} = useQuery({
		queryKey: ["profile", pubkey],
		queryFn: async () => {
			if (embed) {
				const metadata: Metadata = JSON.parse(embed);
				return metadata;
			}

			let normalizeId = pubkey.replace("nostr:", "").replace(/[^\w\s]/gi, "");
			let relayHint: string;

			if (normalizeId.startsWith("nprofile")) {
				const decoded = nip19.decode(normalizeId);

				if (decoded.type === "nprofile") {
					relayHint = decoded.data.relays[0];
					normalizeId = decoded.data.pubkey;
				}
			}

			console.log(relayHint);
			const query = await commands.getProfile(normalizeId);

			if (query.status === "ok") {
				return JSON.parse(query.data) as Metadata;
			} else {
				throw new Error(query.error);
			}
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		staleTime: Number.POSITIVE_INFINITY,
		retry: false,
	});

	return { isLoading, isError, profile };
}
