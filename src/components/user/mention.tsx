import { createCacheProfile, getCacheProfile } from '@utils/storage';
import { truncate } from '@utils/truncate';

import { fetch } from '@tauri-apps/api/http';
import destr from 'destr';
import { memo, useCallback, useEffect, useState } from 'react';

export const UserMention = memo(function UserMention({ pubkey }: { pubkey: string }) {
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async (id: string) => {
    const res = await fetch(`https://rbr.bio/${id}/metadata.json`, {
      method: 'GET',
      timeout: 30,
    });
    return res.data;
  }, []);

  useEffect(() => {
    getCacheProfile(pubkey).then((res) => {
      if (res) {
        setProfile(destr(res.metadata));
      } else {
        fetchProfile(pubkey)
          .then((res: any) => {
            setProfile(destr(res.content));
            createCacheProfile(pubkey, res.content);
          })
          .catch(console.error);
      }
    });
  }, [fetchProfile, pubkey]);

  return <span className="cursor-pointer text-fuchsia-500">@{profile?.name || truncate(pubkey, 16, ' .... ')}</span>;
});
