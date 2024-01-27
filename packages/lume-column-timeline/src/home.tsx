import { RepostNote, TextNote, useArk } from "@lume/ark";
import { ArrowRightCircleIcon, LoaderIcon, SearchIcon } from "@lume/icons";
import { EmptyFeed } from "@lume/ui";
import { FETCH_LIMIT } from "@lume/utils";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { CacheSnapshot, VList, VListHandle } from "virtua";

export function HomeRoute({ colKey }: { colKey: string }) {
	const ark = useArk();
	const ref = useRef<VListHandle>();
	const cacheKey = `${colKey}-vlist`;
	const queryClient = useQueryClient();

	const [offset, cache] = useMemo(() => {
		const serialized = sessionStorage.getItem(cacheKey);
		if (!serialized) return [];
		return JSON.parse(serialized) as [number, CacheSnapshot];
	}, []);

	const { data, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage } =
		useInfiniteQuery({
			queryKey: [colKey],
			initialPageParam: 0,
			queryFn: async ({
				signal,
				pageParam,
			}: {
				signal: AbortSignal;
				pageParam: number;
			}) => {
				if (!ark.account.contacts.length) return [];

				const events = await ark.getInfiniteEvents({
					filter: {
						kinds: [NDKKind.Text, NDKKind.Repost],
						authors: ark.account.contacts,
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
			select: (data) => data?.pages.flatMap((page) => page),
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		});

	const renderItem = (event: NDKEvent) => {
		switch (event.kind) {
			case NDKKind.Text:
				return <TextNote key={event.id} event={event} className="mt-3" />;
			case NDKKind.Repost:
				return <RepostNote key={event.id} event={event} className="mt-3" />;
			default:
				return <TextNote key={event.id} event={event} className="mt-3" />;
		}
	};

	useEffect(() => {
		if (!ref.current) return;
		const handle = ref.current;

		if (offset) {
			handle.scrollTo(offset);
		}

		return () => {
			sessionStorage.setItem(
				cacheKey,
				JSON.stringify([handle.scrollOffset, handle.cache]),
			);
		};
	}, []);

	if (!ark.account.contacts.length) {
		return (
			<div className="px-3 mt-3">
				<EmptyFeed />
				<Link
					to="/suggest"
					className="mt-3 w-full gap-2 inline-flex items-center justify-center text-sm font-medium rounded-lg h-9 bg-blue-500 hover:bg-blue-600 text-white"
				>
					<SearchIcon className="size-5" />
					Find accounts to follow
				</Link>
			</div>
		);
	}

	return (
		<div className="w-full h-full">
			<VList ref={ref} cache={cache} overscan={2} className="flex-1 px-3">
				{isLoading ? (
					<div className="w-full flex h-16 items-center justify-center gap-2 px-3 py-1.5">
						<LoaderIcon className="size-5 animate-spin" />
					</div>
				) : !data.length ? (
					<div className="px-3 mt-3">
						<EmptyFeed />
						<Link
							to="/suggest"
							className="mt-3 w-full gap-2 inline-flex items-center justify-center text-sm font-medium rounded-lg h-9 bg-blue-500 hover:bg-blue-600 text-white"
						>
							<SearchIcon className="size-5" />
							Find accounts to follow
						</Link>
					</div>
				) : (
					data.map((item) => renderItem(item))
				)}
				<div className="flex items-center justify-center h-16">
					{hasNextPage ? (
						<button
							type="button"
							onClick={() => fetchNextPage()}
							disabled={!hasNextPage || isFetchingNextPage}
							className="inline-flex items-center justify-center w-full h-12 gap-2 font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 rounded-xl focus:outline-none"
						>
							{isFetchingNextPage ? (
								<LoaderIcon className="size-5 animate-spin" />
							) : (
								<>
									<ArrowRightCircleIcon className="size-5" />
									Load more
								</>
							)}
						</button>
					) : null}
				</div>
			</VList>
		</div>
	);
}
