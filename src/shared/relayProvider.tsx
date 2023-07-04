import NDK from '@nostr-dev-kit/ndk';
import { createContext } from 'react';

import { initNDK } from '@libs/ndk';
import { getSetting } from '@libs/storage';

export const RelayContext = createContext<NDK>(null);

const relays = await getSetting('relays');
const relaysArray = JSON.parse(relays);
const ndk = await initNDK(relaysArray);

export function RelayProvider({ children }: { children: React.ReactNode }) {
  return <RelayContext.Provider value={ndk}>{children}</RelayContext.Provider>;
}
