import { commands } from "@/commands.gen";
import { toLumeEvents } from "@/commons";
import { RepostNote, Spinner, TextNote } from "@/components";
import type { LumeEvent } from "@/system";
import { Kind } from "@/types";
import { ArrowDown } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type RefObject, useCallback, useRef } from "react";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/columns/_layout/interests/$id")({
	component: Screen,
});

export function Screen() {
	const hashtags = Route.useLoaderData();
	const params = Route.useParams();

	const {
		data,
		isLoading,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		queryKey: ["hashtags", params.id],
		initialPageParam: 0,
		queryFn: async ({ pageParam }: { pageParam: number }) => {
			const tags = hashtags.map((tag) => tag.toLowerCase().replace("#", ""));
			const until = pageParam > 0 ? pageParam.toString() : null;
			const res = await commands.getAllEventsByHashtags(tags, until);

			if (res.status === "error") {
				throw new Error(res.error);
			}

			return toLumeEvents(res.data);
		},
		getNextPageParam: (lastPage) => {
			const lastEvent = lastPage.at(-1);

			if (lastEvent) {
				return lastEvent.created_at - 1;
			}
		},
		select: (data) => data?.pages.flat(),
		refetchOnWindowFocus: false,
	});

	const ref = useRef<HTMLDivElement>(null);

	const renderItem = useCallback(
		(event: LumeEvent) => {
			if (!event) return;
			switch (event.kind) {
				case Kind.Repost: {
					const repostId = event.repostId;

					return (
						<RepostNote
							key={repostId + event.id}
							event={event}
							className="border-b-[.5px] border-neutral-300 dark:border-neutral-700"
						/>
					);
				}
				default:
					return (
						<TextNote
							key={event.id}
							event={event}
							className="border-b-[.5px] border-neutral-300 dark:border-neutral-700"
						/>
					);
			}
		},
		[data],
	);

	return (
		<ScrollArea.Root
			type={"scroll"}
			scrollHideDelay={300}
			className="overflow-hidden size-full px-3"
		>
			<ScrollArea.Viewport
				ref={ref}
				className="relative h-full bg-white dark:bg-neutral-800 rounded-t-xl shadow shadow-neutral-300/50 dark:shadow-none border-[.5px] border-neutral-300 dark:border-neutral-700"
			>
				<Virtualizer scrollRef={ref as unknown as RefObject<HTMLElement>}>
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
							<Spinner className="size-4" />
							<span className="text-sm font-medium">Loading...</span>
						</div>
					) : !data?.length ? (
						<div className="mb-3 flex items-center justify-center h-20 text-sm">
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
								className="inline-flex items-center justify-center w-full gap-2 px-3 text-sm font-medium text-blue-500 h-11 focus:outline-none"
							>
								{isFetchingNextPage ? (
									<Spinner className="size-4" />
								) : (
									<>
										<ArrowDown className="size-4" />
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
