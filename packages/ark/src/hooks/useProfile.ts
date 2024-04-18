import { useQuery } from "@tanstack/react-query";
import { Metadata } from "@lume/types";
import { invoke } from "@tauri-apps/api/core";

export function useProfile(pubkey: string) {
	const {
		isLoading,
		isError,
		data: profile,
	} = useQuery({
		queryKey: ["user", pubkey],
		queryFn: async () => {
			try {
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
		staleTime: Infinity,
		retry: 2,
	});

	return { isLoading, isError, profile };
}
