import { TextNote, useArk } from "@lume/ark";
import { InterestModal } from "@lume/ark/src/components/column/interestModal";
import { ArrowRightCircleIcon, ForyouIcon, LoaderIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { EmptyFeed } from "@lume/ui";
import { FETCH_LIMIT } from "@lume/utils";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { CacheSnapshot, VList, VListHandle } from "virtua";

export function HomeRoute({ colKey }: { colKey: string }) {
	const ark = useArk();
	const storage = useStorage();
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
				if (!storage.interests?.hashtags) return [];

				const events = await ark.getInfiniteEvents({
					filter: {
						kinds: [NDKKind.Text],
						"#t": storage.interests.hashtags.map((item: string) =>
							item.replace("#", "").toLowerCase(),
						),
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
				const queryCacheData = queryClient.getQueryState([colKey])
					?.data as NDKEvent[];
				if (queryCacheData) {
					return {
						pageParams: [undefined, 1],
						pages: [queryCacheData],
					};
				}
			},
			select: (data) => data?.pages.flatMap((page) => page),
			staleTime: 120 * 1000,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		});

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

	if (!storage.interests?.hashtags?.length) {
		return (
			<div className="px-3 mt-3">
				<EmptyFeed subtext="You can more interests to build up your timeline" />
				<InterestModal
					queryKey={[colKey]}
					className="mt-3 w-full text-sm font-medium inline-flex items-center justify-center rounded-lg h-9 bg-blue-500 hover:bg-blue-600 text-white"
				>
					<ForyouIcon className="size-5" />
					Add interest
				</InterestModal>
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
				) : (
					data.map((event) => (
						<TextNote key={event.id} event={event} className="mt-3" />
					))
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
