import { NDKUserProfile } from "@nostr-dev-kit/ndk";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, createContext, useContext } from "react";
import { useArk } from "../../hooks/useArk";

const UserContext = createContext<NDKUserProfile>(null);

export function UserProvider({
	pubkey,
	children,
}: { pubkey: string; children: ReactNode }) {
	const ark = useArk();
	const { data: user } = useQuery({
		queryKey: ["user", pubkey],
		queryFn: async () => {
			const profile = await ark.getUserProfile(pubkey);
			if (!profile)
				throw new Error(
					`Cannot get metadata for ${pubkey}, will be retry after 10 seconds`,
				);
			return profile;
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		staleTime: Infinity,
		retry: 2,
	});

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUserContext() {
	const context = useContext(UserContext);
	return context;
}
