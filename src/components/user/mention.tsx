import { DatabaseContext } from '@components/contexts/database';

import { truncate } from '@utils/truncate';

import { fetch } from '@tauri-apps/api/http';
import { memo, useCallback, useContext, useEffect, useState } from 'react';

export const UserMention = memo(function UserMention({ pubkey }: { pubkey: string }) {
  const { db }: any = useContext(DatabaseContext);
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async (id: string) => {
    const res = await fetch(`https://rbr.bio/${id}/metadata.json`, {
      method: 'GET',
      timeout: 30,
    });
    return res.data;
  }, []);

  const getCacheProfile = useCallback(async () => {
    const result: any = await db.select(`SELECT metadata FROM cache_profiles WHERE id = "${pubkey}"`);
    return result[0];
  }, [db, pubkey]);

  const insertCacheProfile = useCallback(
    async (event) => {
      // insert to database
      await db.execute('INSERT OR IGNORE INTO cache_profiles (id, metadata) VALUES (?, ?);', [pubkey, event.content]);
      // update state
      setProfile(JSON.parse(event.content));
    },
    [db, pubkey]
  );

  useEffect(() => {
    getCacheProfile()
      .then((res) => {
        if (res !== undefined) {
          setProfile(JSON.parse(res.metadata));
        } else {
          fetchProfile(pubkey)
            .then((res) => insertCacheProfile(res))
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, [fetchProfile, getCacheProfile, insertCacheProfile, pubkey]);

  return <span className="text-fuchsia-500">@{profile?.name || truncate(pubkey, 16, ' .... ')}</span>;
});
