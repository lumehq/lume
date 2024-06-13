import { Conversation } from "@/components/conversation";
import { Quote } from "@/components/quote";
import { RepostNote } from "@/components/repost";
import { TextNote } from "@/components/text";
import { ArrowRightCircleIcon } from "@lume/icons";
import { NostrQuery } from "@lume/system";
import {
	type ColumnRouteSearch,
	type NostrEvent,
	type Topic,
	Kind,
} from "@lume/types";
import { Spinner } from "@lume/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useCallback } from "react";
import { Virtualizer } from "virtua";

export const Route = createFileRoute("/topic")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	beforeLoad: async ({ search }) => {
		const key = `lume_topic_${search.label}`;
		const topics = (await NostrQuery.getNstore(key)) as unknown as Topic[];

		if (!topics?.length) {
			throw redirect({
				to: "/create-topic",
				search: {
					...search,
					redirect: "/topic",
				},
			});
		}

		const hashtags: string[] = [];

		for (const topic of topics) {
			hashtags.push(...topic.content);
		}

		return { hashtags };
	},
	component: Screen,
});

export function Screen() {
	const { label, account } = Route.useSearch();
	const { hashtags } = Route.useRouteContext();
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
			const events = NostrQuery.getHashtagEvents(hashtags, pageParam);
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
				<div className="flex items-center justify-center w-full mb-3 h-11 bg-black/10 dark:bg-white/10 backdrop-blur-lg rounded-xl shadow-primary dark:ring-1 ring-neutral-800/50">
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
						className="inline-flex items-center justify-center w-full h-12 gap-2 px-3 font-medium rounded-xl bg-neutral-100 hover:bg-neutral-50 focus:outline-none dark:bg-white/10 dark:hover:bg-white/20"
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
