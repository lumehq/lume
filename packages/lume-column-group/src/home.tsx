import { RepostNote, TextNote, useArk, useStorage } from "@lume/ark";
import { ArrowRightCircleIcon, LoaderIcon } from "@lume/icons";
import { FETCH_LIMIT } from "@lume/utils";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { CacheSnapshot, VList, VListHandle } from "virtua";

export function HomeRoute({
	colKey,
	content,
}: { colKey: string; content: string }) {
	const ark = useArk();
	const ref = useRef<VListHandle>();
	const cacheKey = `${colKey}-vlist`;

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
				const authors: string[] = JSON.parse(content);
				const events = await ark.getInfiniteEvents({
					filter: {
						kinds: [NDKKind.Text, NDKKind.Repost],
						authors: authors,
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

	return (
		<div className="w-full h-full">
			<VList ref={ref} cache={cache} overscan={2} className="flex-1 px-3">
				{isLoading ? (
					<div className="w-full flex h-16 items-center justify-center gap-2 px-3 py-1.5">
						<LoaderIcon className="size-5 animate-spin" />
					</div>
				) : (
					allEvents.map((item) => renderItem(item))
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
