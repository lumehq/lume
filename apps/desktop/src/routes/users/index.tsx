import { NoteSkeleton, RepostNote, TextNote, useArk } from "@lume/ark";
import { ArrowRightCircleIcon, LoaderIcon } from "@lume/icons";
import { FETCH_LIMIT } from "@lume/utils";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { UserProfile } from "./components/profile";

export function UserScreen() {
	const { pubkey } = useParams();
	const ark = useArk();
	const { status, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
		useInfiniteQuery({
			queryKey: ["user-posts", pubkey],
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
						authors: [pubkey],
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

	// render event match event kind
	const renderItem = (event: NDKEvent) => {
		switch (event.kind) {
			case NDKKind.Text:
				return <TextNote key={event.id} event={event} />;
			case NDKKind.Repost:
				return <RepostNote key={event.id} event={event} />;
			default:
				return <TextNote key={event.id} event={event} />;
		}
	};

	return (
		<div className="relative h-full w-full overflow-y-auto">
			<UserProfile pubkey={pubkey} />
			<div className="mt-6 h-full w-full border-t border-neutral-100 px-1.5 dark:border-neutral-900">
				<h3 className="mb-2 pt-4 text-center text-lg font-semibold leading-none text-neutral-900 dark:text-neutral-100">
					Latest posts
				</h3>
				<div className="mx-auto flex h-full max-w-[500px] flex-col justify-between gap-1.5 pb-4 pt-1.5">
					{status === "pending" ? (
						<NoteSkeleton />
					) : (
						allEvents.map((item) => renderItem(item))
					)}
					<div className="flex h-16 items-center justify-center px-3 pb-3">
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
	);
}
