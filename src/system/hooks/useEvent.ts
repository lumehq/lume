import { useQuery } from "@tanstack/react-query";
import { NostrQuery } from "../query";
import { experimental_createPersister } from "@tanstack/query-persist-client-core";

export function useEvent(id: string, relayHint?: string) {
	const { isLoading, isError, data } = useQuery({
		queryKey: ["event", id],
		queryFn: async () => {
			try {
				const event = await NostrQuery.getEvent(id, relayHint);
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
		persister: experimental_createPersister({
			storage: localStorage,
			maxAge: 1000 * 60 * 60 * 12, // 12 hours
		}),
	});

	return { isLoading, isError, data };
}
