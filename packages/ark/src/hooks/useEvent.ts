import type { Event } from "@lume/types";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useEvent(id: string) {
	const { isLoading, isError, data } = useQuery({
		queryKey: ["event", id],
		queryFn: async () => {
			try {
				const eventId: string = id
					.replace("nostr:", "")
					.split("'")[0]
					.split(".")[0];
				const cmd: string = await invoke("get_event", { id: eventId });
				const event: Event = JSON.parse(cmd);
				return event;
			} catch (e) {
				throw new Error(e);
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		staleTime: Number.POSITIVE_INFINITY,
		retry: 2,
	});

	return { isLoading, isError, data };
}
