import { truncate } from '@utils/truncate';

import { fetch } from '@tauri-apps/api/http';
import { memo, useCallback, useEffect, useState } from 'react';

export const UserMention = memo(function UserMention({ pubkey }: { pubkey: string }) {
  const [profile, setProfile] = useState(null);

  const fetchMetadata = useCallback(async (pubkey: string) => {
    const res = await fetch(`https://rbr.bio/${pubkey}/metadata.json`, {
      method: 'GET',
      timeout: 5,
    });
    return res.data;
  }, []);

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
  }, [fetchMetadata, pubkey]);

  useEffect(() => {
    getCachedMetadata().catch(console.error);
  }, [getCachedMetadata]);

  return <span className="cursor-pointer text-fuchsia-500">@{profile?.name || truncate(pubkey, 16, ' .... ')}</span>;
});
