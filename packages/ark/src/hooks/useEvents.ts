import { useInfiniteQuery } from "@tanstack/react-query";
import { useArk } from "./useArk";

const FETCH_LIMIT = 20;
const QUERY_KEY = "local";
const DEDUP = true;

export function useEvents(key: string, account?: string) {
	const ark = useArk();
	const {
		data,
		isError,
		isLoading,
		isRefetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		queryKey: [key, account],
		initialPageParam: 0,
		queryFn: async ({ pageParam }: { pageParam: number }) => {
			const events = await ark.get_events(
				QUERY_KEY,
				FETCH_LIMIT,
				pageParam,
				DEDUP,
			);
			return events;
		},
		getNextPageParam: (lastPage) => {
			const lastEvent = lastPage?.at(-1);
			if (!lastEvent) return;
			return lastEvent.created_at - 1;
		},
		select: (data) => data?.pages.flatMap((page) => page),
		refetchOnWindowFocus: false,
	});

	return {
		data,
		isError,
		isLoading,
		isRefetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	};
}
