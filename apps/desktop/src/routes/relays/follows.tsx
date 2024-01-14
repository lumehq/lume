import { useArk } from "@lume/ark";
import { LoaderIcon, PlusIcon, ShareIcon } from "@lume/icons";
import { useQuery } from "@tanstack/react-query";
import { VList } from "virtua";
import { RelayItem } from "./components/relayItem";

export function RelayFollowsScreen() {
	const ark = useArk();
	const { isLoading, data: relays } = useQuery({
		queryKey: ["relay-follows"],
		queryFn: async ({ signal }: { signal: AbortSignal }) => {
			return await ark.getAllRelaysFromContacts();
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
