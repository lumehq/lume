import { Conversation } from "@/components/conversation";
import { Quote } from "@/components/quote";
import { RepostNote } from "@/components/repost";
import { TextNote } from "@/components/text";
import { ArrowRightCircleIcon } from "@lume/icons";
import { NostrAccount, NostrQuery } from "@lume/system";
import { type ColumnRouteSearch, type NostrEvent, Kind } from "@lume/types";
import { Spinner } from "@lume/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Virtualizer } from "virtua";

export const Route = createFileRoute("/newsfeed")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	beforeLoad: async ({ search }) => {
		const settings = await NostrQuery.getSettings();
		const contacts = await NostrAccount.getContactList();

		if (!contacts.length) {
			throw redirect({
				to: "/create-newsfeed/users",
				search: {
					...search,
					redirect: "/newsfeed",
				},
			});
		}

		return { settings, contacts };
	},
	component: Screen,
});

export function Screen() {
	const { label, account } = Route.useSearch();
	const { contacts, settings } = Route.useRouteContext();
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
			const events = await NostrQuery.getLocalEvents(contacts, pageParam);
			return events;
		},
		getNextPageParam: (lastPage) => lastPage?.at(-1)?.created_at - 1,
		select: (data) => data?.pages.flatMap((page) => page),
		refetchOnWindowFocus: false,
	});

	const renderItem = (event: NostrEvent) => {
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
						<Conversation
							key={event.id}
							className="mb-3"
							event={event}
							gossip={settings?.gossip}
						/>
					);
				}

				if (isQuote) {
					return <Quote key={event.id} event={event} className="mb-3" />;
				}

				return <TextNote key={event.id} event={event} className="mb-3" />;
			}
		}
	};

	return (
		<div className="p-2 w-full h-full overflow-y-auto scrollbar-none">
			{isFetching && !isLoading && !isFetchingNextPage ? (
				<div className="mb-3 w-full h-11 flex items-center justify-center bg-black/10 dark:bg-white/10 backdrop-blur-lg rounded-xl shadow-primary dark:ring-1 ring-neutral-800/50">
					<div className="flex items-center justify-center gap-2">
						<Spinner className="size-5" />
						<span className="text-sm font-medium">Fetching new notes...</span>
					</div>
				</div>
			) : null}
			{isLoading ? (
				<div className="flex h-16 w-full items-center justify-center gap-2">
					<Spinner className="size-5" />
					<span className="text-sm font-medium">Loading...</span>
				</div>
			) : !data.length ? (
				<div className="flex items-center justify-center">
					Yo. You're catching up on all the things happening around you.
				</div>
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
						className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black/5 px-3 font-medium hover:bg-black/10 focus:outline-none dark:bg-white/10 dark:hover:bg-white/20"
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
