import { LumeEvent } from "@/system";
import type { NostrEvent } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { defer } from "@tanstack/react-router";

export const Route = createFileRoute("/columns/_layout/trending")({
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
});
