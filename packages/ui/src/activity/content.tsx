import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { ReplyActivity } from "./reply";
import { RepostActivity } from "./repost";
import { ZapActivity } from "./zap";

export function ActivityContent() {
	const ark = useArk();
	const storage = useStorage();

	const { isLoading, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
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
						"#p": [ark.account.pubkey],
					},
					limit: 100,
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
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
		});

	const allEvents = useMemo(
		() => (data ? data.pages.flatMap((page) => page) : []),
		[data],
	);

	const renderEvent = useCallback((event: NDKEvent) => {
		if (event.pubkey === ark.account.pubkey) return null;

		switch (event.kind) {
			case NDKKind.Text:
				return <ReplyActivity key={event.id} event={event} />;
			case NDKKind.Repost:
				return <RepostActivity key={event.id} event={event} />;
			case NDKKind.Zap:
				return <ZapActivity key={event.id} event={event} />;
			default:
				return <ReplyActivity key={event.id} event={event} />;
		}
	}, []);

	return (
		<div className="w-full h-full flex flex-col justify-between rounded-xl overflow-hidden bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-none dark:ring-1 dark:ring-white/10">
			<div className="h-full w-full min-h-0">
				{isLoading ? (
					<div className="w-[350px] h-full flex items-center justify-center">
						<LoaderIcon className="size-5 animate-spin" />
					</div>
				) : allEvents.length < 1 ? (
					<div className="w-full h-full flex flex-col items-center justify-center">
						<p className="mb-2 text-2xl">🎉</p>
						<p className="text-center font-medium">Yo! Nothing new yet.</p>
					</div>
				) : (
					renderEvent(allEvents[0])
				)}
			</div>
			<div className="h-16 shrink-0 px-3 flex items-center gap-3 bg-neutral-100 dark:bg-neutral-900">
				<button
					type="button"
					className="h-11 flex-1 inline-flex items-center justify-center rounded-xl font-medium bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
				>
					Previous
				</button>
				<button
					type="button"
					className="h-11 flex-1 inline-flex items-center justify-center rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600"
				>
					Next
				</button>
			</div>
		</div>
	);
}
