import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useArk } from "./useArk";

export function useProfile(pubkey: string) {
	const ark = useArk();
	const queryClient = useQueryClient();

	const {
		isLoading,
		isError,
		data: user,
	} = useQuery({
		queryKey: ["user", pubkey],
		queryFn: async () => {
			const profile = await ark.getUserProfile(pubkey);
			if (!profile)
				throw new Error(
					`Cannot get metadata for ${pubkey}, will be retry after 10 seconds`,
				);
			return profile;
		},
		initialData: () => {
			return queryClient.getQueryData(["user", pubkey]);
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		staleTime: Infinity,
		retry: 2,
	});

	return { isLoading, isError, user };
}
