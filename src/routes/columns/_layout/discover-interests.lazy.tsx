import { commands } from "@/commands.gen";
import { toLumeEvents } from "@/commons";
import { Spinner, User } from "@/components";
import { LumeWindow } from "@/system";
import { ArrowDown } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import type { NostrEvent } from "nostr-tools";
import { type RefObject, useCallback, useRef } from "react";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/columns/_layout/discover-interests")(
	{
		component: Screen,
	},
);

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
		queryKey: ["local-interests"],
		initialPageParam: 0,
		queryFn: async ({ pageParam }: { pageParam: number }) => {
			const until = pageParam > 0 ? pageParam.toString() : null;
			const res = await commands.getAllLocalInterests(until);

			if (res.status === "ok") {
				const data = toLumeEvents(res.data);
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
		select: (data) =>
			data?.pages
				.flat()
				.filter(
					(item) => item.tags.filter((tag) => tag[0] === "p")?.length > 0,
				),
		refetchOnWindowFocus: false,
	});

	const ref = useRef<HTMLDivElement>(null);

	const renderItem = useCallback(
		(item: NostrEvent) => {
			const name =
				item.tags.find((tag) => tag[0] === "title")?.[1] || "Unnamed";
			const label =
				item.tags.find((tag) => tag[0] === "label")?.[1] || nanoid();

			return (
				<div
					key={item.id}
					className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-neutral-800/50 shadow-lg shadow-primary dark:ring-1 dark:ring-neutral-800"
				>
					<div className="px-2 pt-2">
						<ScrollArea.Root
							type={"scroll"}
							scrollHideDelay={300}
							className="overflow-hidden size-full"
						>
							<ScrollArea.Viewport className="p-3 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
								<div className="flex flex-wrap items-center justify-center gap-2">
									{item.tags
										.filter((tag) => tag[0] === "t")
										.map((tag) => (
											<div key={tag[1]} className="text-sm font-medium">
												{tag[1].includes("#") ? tag[1] : `#${tag[1]}`}
											</div>
										))}
								</div>
							</ScrollArea.Viewport>
							<ScrollArea.Scrollbar
								className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
								orientation="vertical"
							>
								<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
							</ScrollArea.Scrollbar>
							<ScrollArea.Corner className="bg-transparent" />
						</ScrollArea.Root>
					</div>
					<div className="p-3 flex items-center justify-between">
						<div className="inline-flex items-center gap-2">
							<User.Provider pubkey={item.pubkey}>
								<User.Root>
									<User.Avatar className="size-7 rounded-full" />
								</User.Root>
							</User.Provider>
							<h5 className="text-xs font-medium">{name}</h5>
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() =>
									LumeWindow.openColumn({
										label,
										name,
										url: `/columns/interests/${item.id}`,
									})
								}
								className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-100 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 group-hover:text-white"
							>
								Add
							</button>
						</div>
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
						<div className="inline-flex items-center gap-1.5">
							<Spinner className="size-4" />
							Loading...
						</div>
					) : isError ? (
						<div className="mb-3 flex flex-col items-center justify-center h-16 w-full rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50">
							<p className="text-center">{error?.message ?? "Error"}</p>
						</div>
					) : !data?.length ? (
						<div className="mb-3 flex flex-col items-center justify-center h-16 w-full rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50">
							<p className="text-center">Empty.</p>
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
