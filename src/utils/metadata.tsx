import { Author } from 'nostr-relaypool';

export const fetchMetadata = (pubkey: string, pool: any, relays: any) => {
  const author = new Author(pool, relays, pubkey);
  return new Promise((resolve) => author.metaData(resolve, 0));
};
