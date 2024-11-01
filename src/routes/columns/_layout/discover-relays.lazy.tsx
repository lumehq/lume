import { commands } from "@/commands.gen";
import { Spinner, User } from "@/components";
import { LumeWindow } from "@/system";
import type { NostrEvent } from "@/types";
import { ArrowDown } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type RefObject, useCallback, useRef } from "react";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/columns/_layout/discover-relays")({
	component: Screen,
});

function Screen() {
	const {
		isLoading,
		isError,
		error,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		data,
	} = useInfiniteQuery({
		queryKey: ["discover-relays"],
		initialPageParam: 0,
		queryFn: async ({ pageParam }: { pageParam: number }) => {
			const until = pageParam > 0 ? pageParam.toString() : null;
			const res = await commands.getAllRelays(until);

			if (res.status === "ok") {
				const data: NostrEvent[] = res.data.map((item) => JSON.parse(item));
				return data;
			} else {
				throw new Error(res.error);
			}
		},
		getNextPageParam: (lastPage) => {
			const lastEvent = lastPage.at(-1);

			if (lastEvent) {
				return lastEvent.created_at - 1;
			}
		},
		select: (data) => data?.pages.flat(),
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: false,
	});

	const ref = useRef<HTMLDivElement>(null);

	const renderItem = useCallback(
		(item: NostrEvent) => {
			return (
				<div
					key={item.id}
					className="mb-3 flex flex-col rounded-xl overflow-hidden bg-white dark:bg-neutral-800/50 shadow-lg shadow-primary dark:ring-1 dark:ring-neutral-800"
				>
					<div className="flex flex-col gap-2 p-2">
						{item.tags.map((tag) =>
							tag[1]?.startsWith("wss://") ? (
								<div
									key={tag[1]}
									className="group px-3 flex items-center justify-between h-11 rounded-lg bg-neutral-100 dark:bg-neutral-800"
								>
									<div className="flex-1 truncate select-text text-sm font-medium">
										{tag[1]}
									</div>
									<button
										type="button"
										onClick={() =>
											LumeWindow.openColumn({
												name: tag[1],
												label: `relays_${tag[1].replace(/[^\w\s]/gi, "")}`,
												url: `/columns/relays/${encodeURIComponent(tag[1])}`,
											})
										}
										className="hidden h-6 w-24 shrink-0 group-hover:inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
									>
										View event
									</button>
								</div>
							) : null,
						)}
					</div>
					<div className="p-2 flex items-center">
						<User.Provider pubkey={item.pubkey}>
							<User.Root className="inline-flex items-center gap-2">
								<User.Avatar className="size-7 rounded-full" />
								<User.Name className="text-xs font-medium" />
							</User.Root>
						</User.Provider>
					</div>
				</div>
			);
		},
		[data],
	);

	return (
		<ScrollArea.Root
			type={"scroll"}
			scrollHideDelay={300}
			className="overflow-hidden size-full"
		>
			<ScrollArea.Viewport ref={ref} className="relative h-full px-3 pb-3">
				<Virtualizer scrollRef={ref as unknown as RefObject<HTMLElement>}>
					{isLoading ? (
						<div className="flex items-center justify-center h-20 gap-2">
							<Spinner />
							<p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
								Loading event...
							</p>
						</div>
					) : isError ? (
						<div className="mb-3 flex flex-col items-center justify-center h-16 w-full rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50">
							<p className="text-sm text-center">{error?.message ?? "Error"}</p>
						</div>
					) : !data?.length ? (
						<div className="mb-3 flex flex-col items-center justify-center h-16 w-full rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50">
							<p className="text-sm text-center">
								Nothing to show yet, you can use Lume more and comeback lack to
								see new events.
							</p>
						</div>
					) : (
						data?.map((item) => renderItem(item))
					)}
					{hasNextPage ? (
						<button
							type="button"
							onClick={() => fetchNextPage()}
							disabled={isFetchingNextPage || isLoading}
							className="h-11 w-full px-3 flex items-center justify-center gap-1.5 bg-neutral-200/50 hover:bg-neutral-200 rounded-full text-sm font-medium text-blue-600 dark:hover:bg-neutral-800 dark:bg-neutral-800/50 dark:text-blue-400"
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
