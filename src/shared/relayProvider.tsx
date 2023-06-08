import { initNDK } from "@libs/ndk";
import NDK from "@nostr-dev-kit/ndk";
import { createContext } from "react";

export const RelayContext = createContext<NDK>(null);
const ndk = await initNDK();

export function RelayProvider({ children }: { children: React.ReactNode }) {
	return <RelayContext.Provider value={ndk}>{children}</RelayContext.Provider>;
}
