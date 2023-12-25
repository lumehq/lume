import { RepostNote, TextNote, Widget, useArk, useStorage } from "@lume/ark";
import { ArrowRightCircleIcon, LoaderIcon, TimelineIcon } from "@lume/icons";
import { FETCH_LIMIT } from "@lume/utils";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { VList, VListHandle } from "virtua";

export function TimelineColumn() {
	const ark = useArk();
	const storage = useStorage();
	const ref = useRef<VListHandle>();

	const { data, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage } =
		useInfiniteQuery({
			queryKey: ["newsfeed"],
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
						authors: !storage.account.contacts.length
							? [storage.account.pubkey]
							: storage.account.contacts,
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
				return <TextNote key={event.id} event={event} />;
			case NDKKind.Repost:
				return <RepostNote key={event.id} event={event} />;
			default:
				return <TextNote key={event.id} event={event} />;
		}
	};

	return (
		<Widget.Root>
			<Widget.Header
				id="9999"
				queryKey={["newsfeed"]}
				title="Timeline"
				icon={<TimelineIcon className="h-5 w-5" />}
			/>
			<Widget.Content>
				<VList ref={ref} overscan={2} className="flex-1">
					{isLoading ? (
						<div className="inline-flex h-16 items-center justify-center gap-2 px-3 py-1.5">
							<LoaderIcon className="size-5" />
							Loading
						</div>
					) : (
						allEvents.map((item) => renderItem(item))
					)}
					<div className="flex h-16 items-center justify-center px-3 py-3">
						{hasNextPage ? (
							<button
								type="button"
								onClick={() => fetchNextPage()}
								disabled={!hasNextPage || isFetchingNextPage}
								className="inline-flex h-10 w-max items-center justify-center gap-2 rounded-full bg-blue-500 px-6 font-medium text-white hover:bg-blue-600 focus:outline-none"
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
			</Widget.Content>
		</Widget.Root>
	);
}
