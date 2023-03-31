import { RelayPool } from 'nostr-relaypool';
import { createContext, useMemo } from 'react';

export const RelayContext = createContext({});

const relays = [
  'wss://relay.damus.io',
  'wss://nostr-pub.wellorder.net',
  'wss://nostr.bongbong.com',
  'wss://nostr.zebedee.cloud',
  'wss://nostr.fmt.wiz.biz',
  'wss://relay.snort.social',
  'wss://offchain.pub',
  'wss://relay.current.fyi',
  'wss://nostr.bitcoiner.social',
  'wss://relay.nostr.info',
  'wss://nostr-01.dorafactory.org',
  'wss://nostr.zhongwen.world',
  'wss://nostro.cc',
  'wss://relay.nostr.net.in',
  'wss://nos.lol',
];

export default function RelayProvider({ children }: { children: React.ReactNode }) {
  const pool = useMemo(() => new RelayPool(relays, { useEventCache: false, logSubscriptions: false }), []);
  return <RelayContext.Provider value={[pool, relays]}>{children}</RelayContext.Provider>;
}
