import { commands } from "@/commands.gen";
import type { NostrEvent } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { nip19 } from "nostr-tools";
import { useMemo } from "react";
import { LumeEvent } from "./event";

export function useEvent(id: string, repost?: string) {
	const hex = useMemo(() => {
		try {
			const normalized = id.replace("nostr:", "").replace(/[^\w\s]/gi, "");
			const decoded = nip19.decode(normalized);

			switch (decoded.type) {
				case "note":
					return decoded.data;
				case "nevent":
					return decoded.data.id;
				default:
					return normalized;
			}
		} catch {
			return id;
		}
	}, [id]);

	const { isLoading, isError, error, data } = useQuery({
		queryKey: ["ids", "event", id],
		queryFn: async () => {
			if (repost?.length) {
				const nostrEvent: NostrEvent = JSON.parse(repost);
				const res = await commands.getMetaFromEvent(nostrEvent.content);

				if (res.status === "ok") {
					nostrEvent.meta = res.data;
				}

				return new LumeEvent(nostrEvent);
			}

			const res = await commands.getEvent(hex);

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
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		enabled: !!hex,
	});

	return { isLoading, isError, error, data };
}
