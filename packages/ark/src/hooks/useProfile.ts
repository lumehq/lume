import { useQuery } from "@tanstack/react-query";
import { useArk } from "./useArk";

export function useProfile(pubkey: string) {
	const ark = useArk();
	const {
		isLoading,
		isError,
		data: profile,
	} = useQuery({
		queryKey: ["user", pubkey],
		queryFn: async () => {
			try {
				const profile = await ark.get_profile(pubkey);
				return profile;
			} catch (e) {
				throw new Error(e);
			}
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		staleTime: Infinity,
		retry: 2,
	});

	return { isLoading, isError, profile };
}
