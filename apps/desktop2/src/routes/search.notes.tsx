import { Conversation } from "@/components/conversation";
import { Quote } from "@/components/quote";
import { RepostNote } from "@/components/repost";
import { TextNote } from "@/components/text";
import { LumeEvent, NostrQuery } from "@lume/system";
import { Kind, type NostrEvent } from "@lume/types";
import { Spinner } from "@lume/ui";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { useCallback, useRef } from "react";
import { Virtualizer } from "virtua";

type Search = {
	query: string;
};

export const Route = createFileRoute("/search/notes")({
	validateSearch: (search: Record<string, string>): Search => {
		return {
			query: search.query,
		};
	},
	beforeLoad: async () => {
		const settings = await NostrQuery.getUserSettings();
		return { settings };
	},
	component: Screen,
});

function Screen() {
	const { query } = Route.useSearch();
	const { isLoading, data } = useQuery({
		queryKey: ["search", query],
		queryFn: async () => {
			try {
				const res = await fetch(
					`https://api.nostr.wine/search?query=${query}&kind=1&limit=50`,
				);
				const content = await res.json();
				const events = content.data as NostrEvent[];
				const lumeEvents = await Promise.all(
					events.map(async (item): Promise<LumeEvent> => {
						const event = await LumeEvent.build(item);
						return event;
					}),
				);

				return lumeEvents.sort((a, b) => b.created_at - a.created_at);
			} catch (e) {
				throw new Error(e);
			}
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
					if (event.isConversation) {
						return (
							<Conversation key={event.id} className="mb-3" event={event} />
						);
					}
					if (event.isQuote) {
						return <Quote key={event.id} event={event} className="mb-3" />;
					}
					return <TextNote key={event.id} event={event} className="mb-3" />;
				}
			}
		},
		[data],
	);

	return (
		<ScrollArea.Viewport ref={ref} className="h-full p-3">
			<Virtualizer scrollRef={ref}>
				{isLoading ? (
					<div className="flex items-center justify-center w-full h-11 gap-2">
						<Spinner className="size-5" />
						<span className="text-sm font-medium">Searching...</span>
					</div>
				) : (
					data.map((item) => renderItem(item))
				)}
			</Virtualizer>
		</ScrollArea.Viewport>
	);
}
