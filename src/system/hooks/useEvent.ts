import { type Result, type RichEvent, commands } from "@/commands.gen";
import type { NostrEvent } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { nip19 } from "nostr-tools";
import { LumeEvent } from "../event";

export function useEvent(id: string, hint?: string) {
	const { isLoading, isError, error, data } = useQuery({
		queryKey: ["event", id],
		queryFn: async () => {
			try {
				// Validate ID
				const normalizeId: string = id
					.replace("nostr:", "")
					.replace(/[^\w\s]/gi, "");

				// Define query
				let query: Result<RichEvent, string>;
				let relayHint: string = hint;

				if (normalizeId.startsWith("nevent1")) {
					const decoded = nip19.decode(normalizeId);
					if (decoded.type === "nevent") relayHint = decoded.data.relays[0];
				}

				// Build query
				if (relayHint) {
					try {
						const url = new URL(relayHint);
						query = await commands.getEventFrom(normalizeId, url.toString());
					} catch {
						query = await commands.getEvent(normalizeId);
					}
				} else {
					query = await commands.getEvent(normalizeId);
				}

				if (query.status === "ok") {
					const data = query.data;
					const raw = JSON.parse(data.raw) as NostrEvent;

					if (data?.parsed) {
						raw.meta = data.parsed;
					}

					const event = new LumeEvent(raw);

					return event;
				} else {
					throw new Error(query.error);
				}
			} catch (e) {
				throw new Error(String(e));
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		staleTime: Number.POSITIVE_INFINITY,
		retry: 1,
	});

	return { isLoading, isError, error, data };
}
