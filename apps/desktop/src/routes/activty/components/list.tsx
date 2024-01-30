import { useArk } from "@lume/ark";
import { ArrowRightCircleIcon, LoaderIcon } from "@lume/icons";
import { FETCH_LIMIT } from "@lume/utils";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityRepost } from "./activityRepost";
import { ActivityText } from "./activityText";
import { ActivityZap } from "./activityZap";

export function ActivityList() {
	const ark = useArk();
	const queryClient = useQueryClient();

	const { t } = useTranslation();
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
						kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Zap],
						"#p": [ark.account.pubkey],
					},
					limit: FETCH_LIMIT,
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
				<div className="w-full h-full flex flex-col items-center justify-center">
					<LoaderIcon className="size-5 animate-spin" />
				</div>
			) : !allEvents.length ? (
				<div className="w-full h-full flex flex-col items-center justify-center">
					<p className="mb-2 text-2xl">🎉</p>
					<p className="text-center font-medium">{t("activity.empty")}</p>
				</div>
			) : (
				allEvents.map((event) => renderEvenKind(event))
			)}
			<div className="flex items-center justify-center h-16 px-5">
				{hasNextPage ? (
					<button
						type="button"
						onClick={() => fetchNextPage()}
						disabled={!hasNextPage || isFetchingNextPage}
						className="inline-flex items-center justify-center w-full h-12 gap-2 font-medium bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl focus:outline-none"
					>
						{isFetchingNextPage ? (
							<LoaderIcon className="size-5 animate-spin" />
						) : (
							<>
								<ArrowRightCircleIcon className="size-5" />
								{t("global.loadMore")}
							</>
						)}
					</button>
				) : null}
			</div>
		</div>
	);
}
