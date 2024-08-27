import { Quote, RepostNote, Spinner, TextNote } from "@/components";
import { LumeEvent } from "@/system";
import { Kind, type NostrEvent } from "@/types";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback, useRef } from "react";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/columns/_layout/trending")({
	component: Screen,
});

export function Screen() {
	const { isLoading, isError, data } = useQuery({
		queryKey: ["trending-notes"],
		queryFn: async ({ signal }) => {
			const res = await fetch("https://api.nostr.band/v0/trending/notes", {
				signal,
			});

			if (res.status !== 200) {
				throw new Error("Error.");
			}

			const data: { notes: Array<{ event: NostrEvent }> } = await res.json();
			const events: NostrEvent[] = data.notes.map(
				(item: { event: NostrEvent }) => item.event,
			);
			const lumeEvents = Promise.all(
				events.map(async (ev) => await LumeEvent.build(ev)),
			);

			return lumeEvents;
		},
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
			<ScrollArea.Viewport ref={ref} className="h-full px-3">
				<Virtualizer scrollRef={ref} overscan={1}>
					{isLoading ? (
						<div className="flex flex-col items-center justify-center w-full h-20 gap-1">
							<div className="inline-flex items-center gap-2 text-sm font-medium">
								<Spinner className="size-5" />
								Loading...
							</div>
						</div>
					) : isError ? (
						<div className="flex flex-col items-center justify-center w-full h-20 gap-1">
							<div className="inline-flex items-center gap-2 text-sm font-medium">
								Error.
							</div>
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
