import { useProfile } from "@lume/system";
import type { Metadata } from "@lume/types";
import { type ReactNode, createContext, useContext } from "react";

const UserContext = createContext<{
	pubkey: string;
	profile: Metadata;
	isError: boolean;
	isLoading: boolean;
}>(null);

export function UserProvider({
	pubkey,
	children,
	embedProfile,
}: {
	pubkey: string;
	children: ReactNode;
	embedProfile?: string;
}) {
	const { isLoading, isError, profile } = useProfile(pubkey, embedProfile);

	return (
		<UserContext.Provider value={{ pubkey, profile, isError, isLoading }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUserContext() {
	const context = useContext(UserContext);
	return context;
}
