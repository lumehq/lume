import { useProfile } from "@lume/ark";
import type { Metadata } from "@lume/types";
import { type ReactNode, createContext, useContext } from "react";

const UserContext = createContext<{
	pubkey: string;
	isError: boolean;
	isLoading: boolean;
	profile: Metadata;
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
		<UserContext.Provider value={{ pubkey, isError, isLoading, profile }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUserContext() {
	const context = useContext(UserContext);
	return context;
}
