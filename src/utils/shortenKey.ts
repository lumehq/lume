import { nip19 } from 'nostr-tools';

export function shortenKey(pubkey: string) {
  const npub = nip19.npubEncode(pubkey);
  return npub.substring(0, 16).concat('...');
}

export function displayNpub(pubkey: string, len: number, separator?: string) {
  const npub = nip19.npubEncode(pubkey) as string;
  if (npub.length <= len) return npub;

  separator = separator || ' ... ';

  const sepLen = separator.length,
    charsToShow = len - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return npub.substr(0, frontChars) + separator + npub.substr(npub.length - backChars);
}
