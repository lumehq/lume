import type { Metadata } from "@lume/types";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useProfile(pubkey: string, embed?: string) {
	const {
		isLoading,
		isError,
		data: profile,
	} = useQuery({
		queryKey: ["user", pubkey],
		queryFn: async () => {
			try {
				if (embed) {
					const profile: Metadata = JSON.parse(embed);
					return profile;
				}

				const id = pubkey.replace("nostr:", "").replace(/[^\w\s]/gi, "");
				const cmd: Metadata = await invoke("get_profile", { id });

				return cmd;
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
