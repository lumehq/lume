'use client';

import { DEFAULT_RELAYS } from '@stores/constants';

import { RelayPool } from 'nostr-relaypool';
import { createContext, useMemo } from 'react';

export const RelayContext = createContext({});

const relays = DEFAULT_RELAYS;

export default function RelayProvider({ children }: { children: React.ReactNode }) {
  const pool = useMemo(() => new RelayPool(relays, { useEventCache: false, logSubscriptions: false }), []);
  return <RelayContext.Provider value={[pool, relays]}>{children}</RelayContext.Provider>;
}
