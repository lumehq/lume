import { initNDK } from "@libs/ndk";
import NDK from "@nostr-dev-kit/ndk";
import { FULL_RELAYS } from "@stores/constants";
import { createContext } from "react";

export const RelayContext = createContext<NDK>(null);

const ndk = await initNDK(FULL_RELAYS);

export function RelayProvider({ children }: { children: React.ReactNode }) {
	return <RelayContext.Provider value={ndk}>{children}</RelayContext.Provider>;
}
