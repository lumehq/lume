import { Conversation } from "@/components/conversation";
import { Quote } from "@/components/quote";
import { RepostNote } from "@/components/repost";
import { TextNote } from "@/components/text";
import { ArrowRightCircleIcon } from "@lume/icons";
import { NostrQuery } from "@lume/system";
import { type ColumnRouteSearch, type NostrEvent, Kind } from "@lume/types";
import { Spinner } from "@lume/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { Virtualizer } from "virtua";

export const Route = createFileRoute("/global")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	component: Screen,
});

export function Screen() {
	const { label, account } = Route.useSearch();
	const {
		data,
		isLoading,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		queryKey: [label, account],
		initialPageParam: 0,
		queryFn: async ({ pageParam }: { pageParam: number }) => {
			const events = await NostrQuery.getGlobalEvents(pageParam);
			return events;
		},
		getNextPageParam: (lastPage) => lastPage?.at(-1)?.created_at - 1,
		select: (data) => data?.pages.flatMap((page) => page),
		refetchOnWindowFocus: false,
	});

	const renderItem = useCallback(
		(event: NostrEvent) => {
			if (!event) return;
			switch (event.kind) {
				case Kind.Repost:
					return <RepostNote key={event.id} event={event} />;
				default: {
					const isConversation =
						event.tags.filter((tag) => tag[0] === "e" && tag[3] !== "mention")
							.length > 0;
					const isQuote = event.tags.filter((tag) => tag[0] === "q").length > 0;

					if (isConversation) {
						return (
							<Conversation key={event.id} event={event} className="mb-3" />
						);
					}

					if (isQuote) {
						return <Quote key={event.id} event={event} className="mb-3" />;
					}

					return <TextNote key={event.id} event={event} className="mb-3" />;
				}
			}
		},
		[data],
	);

	return (
		<div className="w-full h-full p-2 overflow-y-auto scrollbar-none">
			{isFetching && !isLoading && !isFetchingNextPage ? (
				<div className="flex items-center justify-center w-full h-11">
					<div className="flex items-center justify-center gap-2">
						<Spinner className="size-5" />
						<span className="text-sm font-medium">Fetching new notes...</span>
					</div>
				</div>
			) : null}
			{isLoading ? (
				<div className="flex items-center justify-center w-full h-16 gap-2">
					<Spinner className="size-5" />
					<span className="text-sm font-medium">Loading...</span>
				</div>
			) : !data.length ? (
				<Empty />
			) : (
				<Virtualizer overscan={3}>
					{data.map((item) => renderItem(item))}
				</Virtualizer>
			)}
			{data?.length && hasNextPage ? (
				<div>
					<button
						type="button"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage || isLoading}
						className="inline-flex items-center justify-center w-full h-12 gap-2 px-3 font-medium rounded-xl bg-black/5 hover:bg-black/10 focus:outline-none dark:bg-white/10 dark:hover:bg-white/20"
					>
						{isFetchingNextPage ? (
							<Spinner className="size-5" />
						) : (
							<>
								<ArrowRightCircleIcon className="size-5" />
								Load more
							</>
						)}
					</button>
				</div>
			) : null}
		</div>
	);
}

function Empty() {
	return (
		<div className="flex flex-col gap-10 py-10">
			<div className="flex flex-col items-center justify-center text-center">
				<div className="flex flex-col items-center justify-end mb-8 overflow-hidden bg-blue-100 rounded-full size-24 dark:bg-blue-900">
					<div className="w-12 h-16 rounded-t-lg bg-gradient-to-b from-blue-500 dark:from-blue-200 to-blue-50 dark:to-blue-900" />
				</div>
				<p className="text-lg font-medium">Your newsfeed is empty</p>
			</div>
		</div>
	);
}
