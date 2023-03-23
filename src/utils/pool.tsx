import { RelayPool } from 'nostr-relaypool';

export function pool({ relays }: { relays: any }) {
  const createPool = new RelayPool(relays, { useEventCache: false, logSubscriptions: false });
  return createPool;
}
