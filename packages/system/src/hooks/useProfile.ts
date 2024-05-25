import type { Metadata } from "@lume/types";
import { useQuery } from "@tanstack/react-query";
import { commands } from "../commands";

export function useProfile(pubkey: string, embed?: string) {
	const {
		isLoading,
		isError,
		data: profile,
	} = useQuery({
		queryKey: ["user", pubkey],
		queryFn: async () => {
			try {
				if (embed) return JSON.parse(embed) as Metadata;

				const normalize = pubkey.replace("nostr:", "").replace(/[^\w\s]/gi, "");
				const query = await commands.getProfile(normalize);

				if (query.status === "ok") {
					return JSON.parse(query.data) as Metadata;
				} else {
					throw new Error(query.error);
				}
			} catch (e) {
				throw new Error(e);
			}
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		staleTime: Number.POSITIVE_INFINITY,
		retry: 2,
	});

	return { isLoading, isError, profile };
}
