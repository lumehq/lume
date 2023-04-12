import { fetch } from '@tauri-apps/api/http';
import { useCallback, useEffect, useState } from 'react';

export const fetchMetadata = async (pubkey: string) => {
  const result = await fetch(`https://rbr.bio/${pubkey}/metadata.json`, {
    method: 'GET',
    timeout: 5,
  });
  return await result.data;
};

export const useMetadata = (pubkey) => {
  const [profile, setProfile] = useState(null);

  /*
  const insertPlebToDB = useCallback(async (account, pubkey, metadata) => {
    const { createPleb } = await import('@utils/bindings');
    return await createPleb({
      pleb_id: pubkey + '-lume' + account.toString(),
      pubkey: pubkey,
      kind: 1,
      metadata: metadata,
      account_id: account,
    }).catch(console.error);
  }, []);
  */

  const getCachedMetadata = useCallback(async () => {
    const { getPlebByPubkey } = await import('@utils/bindings');
    getPlebByPubkey({ pubkey: pubkey })
      .then((res) => {
        if (res) {
          const metadata = JSON.parse(res.metadata);
          // update state
          setProfile(metadata);
        } else {
          fetchMetadata(pubkey).then((res: any) => {
            if (res.content) {
              const metadata = JSON.parse(res.content);
              // update state
              setProfile(metadata);
              // save to database
              // insertPlebToDB(activeAccount.id, pubkey, metadata);
            }
          });
        }
      })
      .catch(console.error);
  }, [pubkey]);

  useEffect(() => {
    getCachedMetadata().catch(console.error);
  }, [getCachedMetadata]);

  return profile;
};
