import { LoaderIcon } from "@lume/icons";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { VList } from "virtua";
import { RelayItem } from "./components/relayItem";

export function RelayGlobalScreen() {
	const { isLoading, data: relays } = useQuery({
		queryKey: ["relay-global"],
		queryFn: async ({ signal }: { signal: AbortSignal }) => {
			const res = await fetch("https://api.nostr.watch/v1/online", { signal });
			if (!res.ok) throw new Error("Failed to get online relays");
			return (await res.json()) as string[];
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	if (isLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<LoaderIcon className="size-5 animate-spin" />
			</div>
		);
	}

	return (
		<VList itemSize={49}>
			{relays.map((item: string) => (
				<RelayItem key={item} url={item} />
			))}
		</VList>
	);
}
