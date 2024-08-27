import { commands } from "@/commands.gen";
import { toLumeEvents } from "@/commons";
import { Quote, RepostNote, Spinner, TextNote } from "@/components";
import type { LumeEvent } from "@/system";
import { Kind } from "@/types";
import { ArrowCircleRight } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback, useRef } from "react";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/columns/_layout/group")({
	component: Screen,
});

export function Screen() {
	const { label, account } = Route.useSearch();
	const { groups } = Route.useRouteContext();
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
			const until = pageParam > 0 ? pageParam.toString() : undefined;
			const res = await commands.getGroupEvents(groups, until);

			if (res.status === "error") {
				throw new Error(res.error);
			}

			return toLumeEvents(res.data);
		},
		getNextPageParam: (lastPage) => lastPage?.at(-1)?.created_at - 1,
		select: (data) => data?.pages.flat(),
		refetchOnWindowFocus: false,
	});

	const ref = useRef<HTMLDivElement>(null);

	const renderItem = useCallback(
		(event: LumeEvent) => {
			if (!event) return;
			switch (event.kind) {
				case Kind.Repost:
					return <RepostNote key={event.id} event={event} className="mb-3" />;
				default: {
					if (event.isQuote) {
						return <Quote key={event.id} event={event} className="mb-3" />;
					} else {
						return <TextNote key={event.id} event={event} className="mb-3" />;
					}
				}
			}
		},
		[data],
	);

	return (
		<ScrollArea.Root
			type={"scroll"}
			scrollHideDelay={300}
			className="overflow-hidden size-full"
		>
			<ScrollArea.Viewport ref={ref} className="h-full px-3 pb-3">
				<Virtualizer scrollRef={ref}>
					{isFetching && !isLoading && !isFetchingNextPage ? (
						<div className="z-50 fixed top-0 left-0 w-full h-14 flex items-center justify-center px-3">
							<div className="w-max h-8 pl-2 pr-3 inline-flex items-center justify-center gap-1.5 rounded-full shadow-lg text-sm font-medium text-white bg-black dark:text-black dark:bg-white">
								<Spinner className="size-4" />
								Getting new notes...
							</div>
						</div>
					) : null}
					{isLoading ? (
						<div className="flex items-center justify-center w-full h-16 gap-2">
							<Spinner className="size-5" />
							<span className="text-sm font-medium">Loading...</span>
						</div>
					) : !data.length ? (
						<div className="mb-3 flex items-center justify-center h-20 text-sm rounded-xl bg-black/5 dark:bg-white/5">
							🎉 Yo. You're catching up on all latest notes.
						</div>
					) : (
						data.map((item) => renderItem(item))
					)}
					{hasNextPage ? (
						<div>
							<button
								type="button"
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage || isLoading}
								className="inline-flex items-center justify-center w-full gap-2 px-3 font-medium h-9 rounded-xl bg-black/5 hover:bg-black/10 focus:outline-none dark:bg-white/10 dark:hover:bg-white/20"
							>
								{isFetchingNextPage ? (
									<Spinner className="size-5" />
								) : (
									<>
										<ArrowCircleRight className="size-5" />
										Load more
									</>
								)}
							</button>
						</div>
					) : null}
				</Virtualizer>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar
				className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
				orientation="vertical"
			>
				<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner className="bg-transparent" />
		</ScrollArea.Root>
	);
}
