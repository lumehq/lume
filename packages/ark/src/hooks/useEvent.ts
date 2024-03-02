import { useQuery } from "@tanstack/react-query";
import { useArk } from "./useArk";

export function useEvent(id: string) {
	const ark = useArk();
	const { isLoading, isError, data } = useQuery({
		queryKey: ["event", id],
		queryFn: async () => {
			try {
				const event = await ark.get_event(id);
				return event;
			} catch (e) {
				throw new Error(e);
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		staleTime: Infinity,
		retry: 2,
	});

	return { isLoading, isError, data };
}
