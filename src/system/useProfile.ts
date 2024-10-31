import { commands } from "@/commands.gen";
import type { Metadata } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { nip19 } from "nostr-tools";
import { useMemo } from "react";

export function useProfile(pubkey: string, data?: string) {
	const hex = useMemo(() => {
		try {
			const normalized = pubkey.replace("nostr:", "").replace(/[^\w\s]/gi, "");
			const decoded = nip19.decode(normalized);

			switch (decoded.type) {
				case "npub":
					return decoded.data;
				case "nprofile":
					return decoded.data.pubkey;
				case "naddr":
					return decoded.data.pubkey;
				default:
					return normalized;
			}
		} catch {
			return pubkey;
		}
	}, [pubkey]);

	const { isLoading, data: profile } = useQuery({
		queryKey: ["profile", hex],
		queryFn: async () => {
			if (data?.length) {
				const metadata: Metadata = JSON.parse(data);
				return metadata;
			}

			const res = await commands.getProfile(hex);

			if (res.status === "ok") {
				const metadata: Metadata = JSON.parse(res.data);
				return metadata;
			} else {
				await getCurrentWindow().emit("request_metadata", { id: hex });
				throw new Error(res.error);
			}
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		enabled: !!hex,
		retry: false,
	});

	return { isLoading, profile };
}
