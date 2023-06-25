import { getActiveAccount } from "@libs/storage";
import { useQuery } from "@tanstack/react-query";

export function useAccount() {
	const { status, data: account } = useQuery(
		["currentAccount"],
		async () => await getActiveAccount(),
		{
			staleTime: Infinity,
			refetchOnMount: true,
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
		},
	);

	return { status, account };
}
