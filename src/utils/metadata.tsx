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

  const getCachedMetadata = useCallback(async () => {
    const { getPlebByPubkey } = await import('@utils/bindings');
    getPlebByPubkey({ pubkey: pubkey })
      .then((res) => {
        if (res) {
          const metadata = JSON.parse(res.metadata);
          setProfile(metadata);
        } else {
          fetchMetadata(pubkey).then((res: any) => {
            if (res.content) {
              const metadata = JSON.parse(res.content);
              setProfile(metadata);
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
