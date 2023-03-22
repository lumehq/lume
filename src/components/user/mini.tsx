import { DatabaseContext } from '@components/contexts/database';
import { ImageWithFallback } from '@components/imageWithFallback';

import { truncate } from '@utils/truncate';

import { fetch } from '@tauri-apps/api/http';
import Avatar from 'boring-avatars';
import { memo, useCallback, useContext, useEffect, useState } from 'react';

export const UserMini = memo(function UserMini({ pubkey }: { pubkey: string }) {
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
      // update state
      setProfile(JSON.parse(event.content));
      // insert to database
      await db.execute('INSERT OR IGNORE INTO cache_profiles (id, metadata) VALUES (?, ?);', [pubkey, event.content]);
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

  return (
    <div className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium hover:bg-zinc-900">
      <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded">
        {profile?.picture ? (
          <ImageWithFallback src={profile.picture} alt={pubkey} fill={true} className="rounded object-cover" />
        ) : (
          <Avatar
            size={20}
            name={pubkey}
            variant="beam"
            square={true}
            colors={['#FEE2E2', '#FEF3C7', '#F59E0B', '#EC4899', '#D946EF', '#8B5CF6']}
          />
        )}
      </div>
      <div className="inline-flex w-full flex-1 flex-col overflow-hidden">
        <p className="truncate leading-tight text-zinc-300">{profile?.name || truncate(pubkey, 16, ' .... ')}</p>
      </div>
    </div>
  );
});
