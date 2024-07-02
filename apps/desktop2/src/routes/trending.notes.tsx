import { Conversation } from "@/components/conversation";
import { Quote } from "@/components/quote";
import { RepostNote } from "@/components/repost";
import { TextNote } from "@/components/text";
import { LumeEvent } from "@lume/system";
import { Kind, type NostrEvent } from "@lume/types";
import { Spinner } from "@lume/ui";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Await, createFileRoute } from "@tanstack/react-router";
import { defer } from "@tanstack/react-router";
import { Suspense, useCallback, useRef } from "react";
import { Virtualizer } from "virtua";

export const Route = createFileRoute("/trending/notes")({
	loader: async ({ abortController }) => {
		try {
			return {
				data: defer(
					fetch("https://api.nostr.band/v0/trending/notes", {
						signal: abortController.signal,
					})
						.then((res) => res.json())
						.then((res) => {
							const events: NostrEvent[] = res.notes.map(
								(item: { event: NostrEvent }) => item.event,
							);
							const lumeEvents = Promise.all(
								events.map(async (ev) => await LumeEvent.build(ev)),
							);
							return lumeEvents;
						}),
				),
			};
		} catch (e) {
			throw new Error(String(e));
		}
	},
	component: Screen,
});

export function Screen() {
	const { data } = Route.useLoaderData();

	const ref = useRef<HTMLDivElement>(null);
	const renderItem = useCallback((event: LumeEvent) => {
		if (!event) return;
		switch (event.kind) {
			case Kind.Repost:
				return <RepostNote key={event.id} event={event} className="mb-3" />;
			default: {
				if (event.isConversation) {
					return <Conversation key={event.id} className="mb-3" event={event} />;
				}
				if (event.isQuote) {
					return <Quote key={event.id} event={event} className="mb-3" />;
				}
				return <TextNote key={event.id} event={event} className="mb-3" />;
			}
		}
	}, []);

	return (
		<ScrollArea.Root
			type={"scroll"}
			scrollHideDelay={300}
			className="overflow-hidden size-full"
		>
			<ScrollArea.Viewport ref={ref} className="h-full px-3 pb-3">
				<Virtualizer scrollRef={ref}>
					<Suspense
						fallback={
							<div className="flex flex-col items-center justify-center w-full h-20 gap-1">
								<button
									type="button"
									className="inline-flex items-center gap-2 text-sm font-medium"
									disabled
								>
									<Spinner className="size-5" />
									Loading...
								</button>
							</div>
						}
					>
						<Await promise={data}>
							{(notes) => notes.map((event) => renderItem(event))}
						</Await>
					</Suspense>
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
