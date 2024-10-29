import { useProfile } from "@/system";
import type { Metadata } from "@/types";
import { type ReactNode, createContext, useContext } from "react";

interface UserContext {
	pubkey: string;
	profile: Metadata | undefined;
	isLoading: boolean;
}

const UserContext = createContext<UserContext | null>(null);

export function UserProvider({
	pubkey,
	children,
	data,
}: {
	pubkey: string;
	children: ReactNode;
	data?: string;
}) {
	const { isLoading, profile } = useProfile(pubkey, data);

	return (
		<UserContext.Provider value={{ pubkey, isLoading, profile }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUserContext() {
	const context = useContext(UserContext);
	return context;
}
