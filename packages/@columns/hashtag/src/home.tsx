import { TextNote, useArk } from "@lume/ark";
import { ArrowRightCircleIcon, LoaderIcon } from "@lume/icons";
import { FETCH_LIMIT } from "@lume/utils";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { CacheSnapshot, VList, VListHandle } from "virtua";

export function HomeRoute({
	colKey,
	hashtag,
}: { colKey: string; hashtag: string }) {
	const ark = useArk();
	const ref = useRef<VListHandle>();
	const cacheKey = "hashtag-vlist";

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
				const events = await ark.getInfiniteEvents({
					filter: {
						kinds: [NDKKind.Text],
						"#t": [hashtag],
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
			refetchOnWindowFocus: false,
		});

	const allEvents = useMemo(
		() => (data ? data.pages.flatMap((page) => page) : []),
		[data],
	);

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

	return (
		<div className="w-full h-full">
			<VList ref={ref} cache={cache} overscan={2} className="flex-1 px-3">
				{isLoading ? (
					<div className="w-full flex h-16 items-center justify-center gap-2 px-3 py-1.5">
						<LoaderIcon className="size-5 animate-spin" />
					</div>
				) : (
					allEvents.map((item) => (
						<TextNote key={item.id} event={item} className="mt-3" />
					))
				)}
				<div className="flex h-16 items-center justify-center">
					{hasNextPage ? (
						<button
							type="button"
							onClick={() => fetchNextPage()}
							disabled={!hasNextPage || isFetchingNextPage}
							className="inline-flex h-10 w-40 items-center justify-center gap-2 rounded-full bg-blue-500 font-medium text-white hover:bg-blue-600 focus:outline-none"
						>
							{isFetchingNextPage ? (
								<LoaderIcon className="h-5 w-5 animate-spin" />
							) : (
								<>
									<ArrowRightCircleIcon className="h-5 w-5" />
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
