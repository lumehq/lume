import { useQuery } from "@tanstack/react-query";
import { NostrQuery } from "../query";

export function useEvent(id: string) {
	const { isLoading, isError, data } = useQuery({
		queryKey: ["event", id],
		queryFn: async () => {
			try {
				const event = await NostrQuery.getEvent(id);
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
