import { persistentAtom } from '@nanostores/persistent';

export const relays = persistentAtom(
  'relays',
  [
    'wss://relay.uselume.xyz',
    'wss://nostr-pub.wellorder.net',
    'wss://nostr.bongbong.com',
    'wss://nostr.zebedee.cloud',
    'wss://nostr.fmt.wiz.biz',
    'wss://nostr.walletofsatoshi.com',
    'wss://relay.snort.social',
    'wss://offchain.pub',
    'wss://nos.lol',
    'wss://relay.damus.io',
  ],
  {
    encode(value) {
      return JSON.stringify(value);
    },
    decode(value) {
      return JSON.parse(value);
    },
  }
);
