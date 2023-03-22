import { DatabaseContext } from '@components/contexts/database';
import { ImageWithFallback } from '@components/imageWithFallback';

import { truncate } from '@utils/truncate';

import { fetch } from '@tauri-apps/api/http';
import { memo, useCallback, useContext, useEffect, useState } from 'react';

export const UserBase = memo(function UserBase({ pubkey }: { pubkey: string }) {
  const { db }: any = useContext(DatabaseContext);
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async (id: string) => {
    const res = await fetch(`https://rbr.bio/${id}/metadata.json`, {
      method: 'GET',
      timeout: 30,
    });
    return res;
  }, []);

  const cacheProfile = useCallback(
    async (event) => {
      // insert to database
      await db.execute('INSERT OR IGNORE INTO cache_profiles (id, metadata) VALUES (?, ?);', [pubkey, event.content]);
      // update state
      setProfile(JSON.parse(event.content));
    },
    [db, pubkey]
  );

  useEffect(() => {
    fetchProfile(pubkey)
      .then((res) => cacheProfile(res))
      .catch(console.error);
  }, [fetchProfile, cacheProfile, pubkey]);

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-full border border-white/10">
        {profile?.picture && (
          <ImageWithFallback src={profile.picture} alt={pubkey} fill={true} className="rounded-full object-cover" />
        )}
      </div>
      <div className="flex w-full flex-1 flex-col items-start">
        <span className="font-medium leading-tight text-zinc-200">{profile?.display_name || profile?.name}</span>
        <span className="text-sm leading-tight text-zinc-400">{truncate(pubkey, 16, ' .... ')}</span>
      </div>
    </div>
  );
});
