import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { useQuery } from "@tanstack/react-query";
import { VList } from "virtua";
import { RelayItem } from "./components/relayItem";

export function RelayFollowsScreen() {
	const ark = useArk();
	const {
		isLoading,
		isError,
		data: relays,
	} = useQuery({
		queryKey: ["relay-follows"],
		queryFn: async ({ signal }: { signal: AbortSignal }) => {
			const data = await ark.getAllRelaysFromContacts({ signal });
			if (!data) throw new Error("Failed to get relay list from contacts");
			return data;
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});

	if (isLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<LoaderIcon className="size-5 animate-spin" />
			</div>
		);
	}

	if (isError || !relays) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p>Error</p>
			</div>
		);
	}

	return (
		<VList itemSize={49}>
			{[...relays].map(([key, value]) => (
				<RelayItem key={key} url={key} users={value} />
			))}
		</VList>
	);
}
