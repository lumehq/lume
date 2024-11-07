import { commands } from "@/commands.gen";
import { toLumeEvents } from "@/commons";
import { RepostNote, Spinner, TextNote } from "@/components";
import type { LumeEvent } from "@/system";
import { Kind } from "@/types";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type RefObject, useCallback, useRef } from "react";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/columns/_layout/dvm/$id")({
	component: Screen,
});

function Screen() {
	const { id } = Route.useParams();
	const { account } = Route.useSearch();
	const { isLoading, isError, error, data } = useQuery({
		queryKey: ["job-result", id],
		queryFn: async () => {
			if (!account) {
				throw new Error("Account is required");
			}

			const res = await commands.getAllEventsByRequest(account, id);

			if (res.status === "error") {
				throw new Error(res.error);
			}

			return toLumeEvents(res.data);
		},
		refetchOnWindowFocus: false,
	});

	const ref = useRef<HTMLDivElement>(null);

	const renderItem = useCallback(
		(event: LumeEvent) => {
			if (!event) {
				return;
			}

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
					{isLoading ? (
						<div className="flex items-center justify-center w-full h-16 gap-2">
							<Spinner className="size-4" />
							<span className="text-sm font-medium">Requesting events...</span>
						</div>
					) : isError ? (
						<div className="flex items-center justify-center w-full h-16 gap-2">
							<span className="text-sm font-medium">{error?.message}</span>
						</div>
					) : !data?.length ? (
						<div className="mb-3 flex items-center justify-center h-20 text-sm">
							🎉 Yo. You're catching up on all latest notes.
						</div>
					) : (
						data.map((item) => renderItem(item))
					)}
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
