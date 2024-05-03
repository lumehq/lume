import { RepostNote } from "@/components/repost";
import { TextNote } from "@/components/text";
import { ArrowRightCircleIcon, ArrowRightIcon } from "@lume/icons";
import { type ColumnRouteSearch, type Event, Kind } from "@lume/types";
import { Spinner } from "@lume/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { Virtualizer } from "virtua";

export const Route = createFileRoute("/foryou")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	beforeLoad: async ({ search, context }) => {
		const ark = context.ark;
		const interests = await ark.get_interest();
		const settings = await ark.get_settings();

		if (!interests) {
			throw redirect({
				to: "/interests",
				search: {
					...search,
					redirect: "/foryou",
				},
			});
		}

		return {
			interests,
			settings,
		};
	},
	component: Screen,
});

export function Screen() {
	const { name, account } = Route.useSearch();
	const { ark, interests } = Route.useRouteContext();
	const {
		data,
		isLoading,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		queryKey: [name, account],
		initialPageParam: 0,
		queryFn: async ({ pageParam }: { pageParam: number }) => {
			const events = await ark.get_events_from_interests(
				interests.hashtags,
				20,
				pageParam,
			);
			return events;
		},
		getNextPageParam: (lastPage) => {
			const lastEvent = lastPage?.at(-1);
			return lastEvent ? lastEvent.created_at - 1 : null;
		},
		select: (data) => data?.pages.flatMap((page) => page),
		refetchOnWindowFocus: false,
	});

	const renderItem = (event: Event) => {
		if (!event) return;
		switch (event.kind) {
			case Kind.Repost:
				return <RepostNote key={event.id} event={event} />;
			default:
				return <TextNote key={event.id} event={event} />;
		}
	};

	return (
		<div className="p-2 w-full h-full overflow-y-auto scrollbar-none">
			{isFetching && !isLoading && !isFetchingNextPage ? (
				<div className="w-full h-11 flex items-center justify-center">
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
						className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neutral-100 px-3 font-medium hover:bg-neutral-50 focus:outline-none dark:bg-white/10 dark:hover:bg-white/20"
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
		<div className="flex flex-col py-10 gap-10">
			<div className="text-center flex flex-col items-center justify-center">
				<div className="size-24 bg-blue-100 flex flex-col items-center justify-end overflow-hidden dark:bg-blue-900 rounded-full mb-8">
					<div className="w-12 h-16 bg-gradient-to-b from-blue-500 dark:from-blue-200 to-blue-50 dark:to-blue-900 rounded-t-lg" />
				</div>
				<p className="text-lg font-medium">Your newsfeed is empty</p>
				<p className="leading-tight text-neutral-700 dark:text-neutral-300">
					Here are few suggestions to get started.
				</p>
			</div>
			<div className="flex flex-col px-3 gap-2">
				<Link
					to="/trending/notes"
					className="h-11 w-full flex items-center hover:bg-neutral-200 text-sm font-medium dark:hover:bg-neutral-800 gap-2 bg-neutral-100 rounded-lg dark:bg-neutral-900 px-3"
				>
					<ArrowRightIcon className="size-5" />
					Show trending notes
				</Link>
				<Link
					to="/trending/users"
					className="h-11 w-full flex items-center hover:bg-neutral-200 text-sm font-medium dark:hover:bg-neutral-800 gap-2 bg-neutral-100 rounded-lg dark:bg-neutral-900 px-3"
				>
					<ArrowRightIcon className="size-5" />
					Discover trending users
				</Link>
			</div>
		</div>
	);
}
