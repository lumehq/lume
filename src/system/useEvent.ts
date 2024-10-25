import { commands } from "@/commands.gen";
import type { NostrEvent } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { nip19 } from "nostr-tools";
import { LumeEvent } from "./event";

export function useEvent(id: string, repost?: string) {
	const { isLoading, isError, error, data } = useQuery({
		queryKey: ["ids", "event", id],
		queryFn: async () => {
			try {
				if (repost?.length) {
					const nostrEvent: NostrEvent = JSON.parse(repost);
					const res = await commands.getMetaFromEvent(nostrEvent.content);

					if (res.status === "ok") {
						nostrEvent.meta = res.data;
					}

					return new LumeEvent(nostrEvent);
				}

				let normalizedId = id.replace("nostr:", "").replace(/[^\w\s]/gi, "");

				if (normalizedId.startsWith("nevent")) {
					const decoded = nip19.decode(normalizedId);

					if (decoded.type === "nevent") {
						normalizedId = decoded.data.id;
					}
				}

				const res = await commands.getEvent(normalizedId);

				if (res.status === "ok") {
					const data = res.data;
					const raw: NostrEvent = JSON.parse(data.raw);

					if (data.parsed) {
						raw.meta = data.parsed;
					}

					return new LumeEvent(raw);
				} else {
					throw new Error(res.error);
				}
			} catch (e) {
				throw new Error(String(e));
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});

	return { isLoading, isError, error, data };
}
