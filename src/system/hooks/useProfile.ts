import { commands } from "@/commands.gen";
import type { Metadata } from "@/types";
import { experimental_createPersister } from "@tanstack/query-persist-client-core";
import { useQuery } from "@tanstack/react-query";

export function useProfile(pubkey: string, embed?: string) {
	const {
		isLoading,
		isError,
		data: profile,
	} = useQuery({
		queryKey: ["profile", pubkey],
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
		persister: experimental_createPersister({
			storage: localStorage,
			maxAge: 1000 * 60 * 60 * 24, // 24 hours
		}),
	});

	return { isLoading, isError, profile };
}
