import { RelayContext } from '@components/relaysProvider';

import { Author } from 'nostr-relaypool';
import { useCallback, useContext, useEffect, useState } from 'react';

export const fetchMetadata = (pubkey: string, pool: any, relays: any) => {
  const author = new Author(pool, relays, pubkey);
  return new Promise((resolve) => author.metaData(resolve, 0));
};

export const useMetadata = (pubkey) => {
  const [pool, relays]: any = useContext(RelayContext);
  const [profile, setProfile] = useState(null);

  const getCachedMetadata = useCallback(async () => {
    const { getPlebByPubkey } = await import('@utils/bindings');
    getPlebByPubkey({ pubkey: pubkey })
      .then((res) => {
        if (res) {
          const metadata = JSON.parse(res.metadata);
          setProfile(metadata);
        } else {
          fetchMetadata(pubkey, pool, relays).then((res: any) => {
            if (res.content) {
              const metadata = JSON.parse(res.content);
              setProfile(metadata);
            }
          });
        }
      })
      .catch(console.error);
  }, [pool, relays, pubkey]);

  useEffect(() => {
    getCachedMetadata().catch(console.error);
  }, [getCachedMetadata]);

  return profile;
};
