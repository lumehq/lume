import { commands } from "@/commands.gen";
import type { Metadata } from "@/types";
import { useQuery } from "@tanstack/react-query";

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

			const normalize = pubkey.replace("nostr:", "").replace(/[^\w\s]/gi, "");
			const query = await commands.getProfile(normalize);

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
		retry: 1,
	});

	return { isLoading, isError, profile };
}
