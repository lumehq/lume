import { nip19 } from 'nostr-tools';

export function shortenKey(pubkey: string) {
  const npub = nip19.npubEncode(pubkey);
  return npub.substring(0, 16).concat('...');
}
