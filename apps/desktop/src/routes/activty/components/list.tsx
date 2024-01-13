import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { FETCH_LIMIT } from "@lume/utils";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { ActivityRepost } from "./activityRepost";
import { ActivityText } from "./activityText";
import { ActivityZap } from "./activityZap";

export function ActivityList() {
	const ark = useArk();
	const queryClient = useQueryClient();

	const { data, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage } =
		useInfiniteQuery({
			queryKey: ["activity"],
			initialPageParam: 0,
			queryFn: async ({
				signal,
				pageParam,
			}: {
				signal: AbortSignal;
				pageParam: number;
			}) => {
				const events = await ark.getInfiniteEvents({
					filter: {
						kinds: [NDKKind.Zap],
						"#p": [
							"126103bfddc8df256b6e0abfd7f3797c80dcc4ea88f7c2f87dd4104220b4d65f",
							ark.account.pubkey,
						],
					},
					limit: 200,
					pageParam,
					signal,
				});

				return events;
			},
			getNextPageParam: (lastPage) => {
				const lastEvent = lastPage.at(-1);
				if (!lastEvent) return;
				return lastEvent.created_at - 1;
			},
			initialData: () => {
				const queryCacheData = queryClient.getQueryState(["activity"])
					?.data as NDKEvent[];
				if (queryCacheData) {
					return {
						pageParams: [undefined, 1],
						pages: [queryCacheData],
					};
				}
			},

			staleTime: 360 * 1000,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		});

	const allEvents = useMemo(
		() => (data ? data.pages.flatMap((page) => page) : []),
		[data],
	);

	const renderEvenKind = useCallback(
		(event: NDKEvent) => {
			if (event.pubkey === ark.account.pubkey) return null;
			switch (event.kind) {
				case NDKKind.Text:
					return <ActivityText key={event.id} event={event} />;
				case NDKKind.Repost:
					return <ActivityRepost key={event.id} event={event} />;
				case NDKKind.Zap:
					return <ActivityZap key={event.id} event={event} />;
				default:
					return <ActivityText key={event.id} event={event} />;
			}
		},
		[data],
	);

	return (
		<div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
			{isLoading ? (
				<div className="h-24 flex items-center justify-center">
					<LoaderIcon className="size-5 animate-spin" />
				</div>
			) : (
				allEvents.map((event) => renderEvenKind(event))
			)}
		</div>
	);
}
