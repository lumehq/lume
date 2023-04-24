import { DEFAULT_RELAYS } from '@stores/constants';

import { RelayPool } from 'nostr-relaypool';
import { createContext, useMemo } from 'react';

export const RelayContext = createContext({});

export default function RelayProvider({ children }: { children: React.ReactNode }) {
  const pool = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new RelayPool(DEFAULT_RELAYS, { useEventCache: false, logSubscriptions: false });
    } else {
      return null;
    }
  }, []);
  return <RelayContext.Provider value={pool}>{children}</RelayContext.Provider>;
}
