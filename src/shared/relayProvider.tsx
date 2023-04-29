import { FULL_RELAYS } from '@lume/stores/constants';

import { RelayPool } from 'nostr-relaypool';
import { createContext } from 'react';

export const RelayContext = createContext({});

const pool = new RelayPool(FULL_RELAYS, {
  useEventCache: false,
  subscriptionCache: true,
  logErrorsAndNotices: false,
  logSubscriptions: false,
});

export default function RelayProvider({ children }: { children: React.ReactNode }) {
  return <RelayContext.Provider value={pool}>{children}</RelayContext.Provider>;
}
