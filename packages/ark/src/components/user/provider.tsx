import { Metadata } from "@lume/types";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, createContext, useContext } from "react";
import { useArk } from "../../hooks/useArk";

const UserContext = createContext<{ pubkey: string; profile: Metadata }>(null);

export function UserProvider({
	pubkey,
	children,
	embed,
}: { pubkey: string; children: ReactNode; embed?: string }) {
	const ark = useArk();
	const { data: profile } = useQuery({
		queryKey: ["user", pubkey],
		queryFn: async () => {
			if (embed) return JSON.parse(embed) as Metadata;

			const profile = await ark.get_profile(pubkey);

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

	return (
		<UserContext.Provider value={{ pubkey, profile }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUserContext() {
	const context = useContext(UserContext);
	return context;
}
