import { DatabaseContext } from '@components/contexts/database';

import { truncate } from '@utils/truncate';

import { memo, useCallback, useContext, useMemo, useState } from 'react';

export const UserMention = memo(function UserMention({ pubkey }: { pubkey: string }) {
  const { db }: any = useContext(DatabaseContext);
  const [profile, setProfile] = useState({ name: null });

  const insertCacheProfile = useCallback(
    async (event) => {
      // insert to database
      await db.execute('INSERT OR IGNORE INTO cache_profiles (id, metadata) VALUES (?, ?);', [pubkey, event.content]);
      // update state
      setProfile(JSON.parse(event.content));
    },
    [db, pubkey]
  );

  const getCacheProfile = useCallback(async () => {
    const result: any = await db.select(`SELECT metadata FROM cache_profiles WHERE id = "${pubkey}"`);
    return result[0];
  }, [db, pubkey]);

  useMemo(() => {
    getCacheProfile()
      .then((res) => {
        if (res !== undefined) {
          setProfile(JSON.parse(res.metadata));
        } else {
          fetch(`https://rbr.bio/${pubkey}/metadata.json`, { redirect: 'follow' })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else if (response.status === 404) {
                return Promise.reject('error 404');
              } else {
                return Promise.reject('some other error: ' + response.status);
              }
            })
            .then((data) => insertCacheProfile(data))
            .catch((error) => console.log('error is', error));
        }
      })
      .catch(console.error);
  }, [getCacheProfile, insertCacheProfile, pubkey]);

  return <span className="text-fuchsia-500">@{profile.name ? profile.name : truncate(pubkey, 16, ' .... ')}</span>;
});
