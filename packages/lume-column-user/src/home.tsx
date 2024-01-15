import { RepostNote, TextNote, User, useArk } from "@lume/ark";
import { ArrowRightCircleIcon, LoaderIcon } from "@lume/icons";
import { FETCH_LIMIT } from "@lume/utils";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { WindowVirtualizer } from "virtua";

export function HomeRoute({ id }: { id: string }) {
	const ark = useArk();
	const { data, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage } =
		useInfiniteQuery({
			queryKey: ["user-posts", id],
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
						kinds: [NDKKind.Text, NDKKind.Repost],
						authors: [id],
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

	return (
		<div className="py-5 overflow-y-auto">
			<WindowVirtualizer>
				<div className="px-3">
					<User.Provider pubkey={id}>
						<User.Root className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<User.Avatar className="h-12 w-12 shrink-0 rounded-lg object-cover" />
								<User.Button
									target={id}
									className="inline-flex items-center justify-center w-24 text-sm font-semibold border-t rounded-lg border-neutral-900 dark:border-neutral-800 h-9 bg-neutral-950 text-neutral-50 dark:bg-neutral-900 hover:bg-neutral-900 dark:hover:bg-neutral-800"
								/>
							</div>
							<div className="flex flex-1 flex-col gap-1.5">
								<div className="flex flex-col">
									<User.Name className="text-lg font-semibold" />
									<User.NIP05
										pubkey={id}
										className="max-w-[15rem] truncate text-sm text-neutral-600 dark:text-neutral-400"
									/>
								</div>
								<User.About className="text-neutral-900 dark:text-neutral-100" />
							</div>
						</User.Root>
					</User.Provider>
					<div className="pt-2 mt-2 border-t border-neutral-100 dark:border-neutral-900">
						<h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
							Latest posts
						</h3>
						<div className="flex h-full w-full flex-col justify-between gap-1.5 pb-10">
							{isLoading ? (
								<div className="flex items-center justify-center">
									<LoaderIcon className="w-4 h-4 animate-spin" />
								</div>
							) : (
								allEvents.map((item) => renderItem(item))
							)}
							<div className="flex items-center justify-center h-16 px-3 pb-3">
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
						</div>
					</div>
				</div>
			</WindowVirtualizer>
		</div>
	);
}
