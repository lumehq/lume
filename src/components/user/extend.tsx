import { DatabaseContext } from '@components/contexts/database';
import { ImageWithFallback } from '@components/imageWithFallback';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { fetch } from '@tauri-apps/api/http';
import Avatar from 'boring-avatars';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { memo, useCallback, useContext, useEffect, useState } from 'react';

dayjs.extend(relativeTime);

export const UserExtend = memo(function UserExtend({ pubkey, time }: { pubkey: string; time: any }) {
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
    <div className="flex items-start gap-2">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-zinc-900">
        {profile?.picture ? (
          <ImageWithFallback
            src={profile.picture}
            alt={pubkey}
            fill={true}
            className="rounded-md border border-white/10 object-cover"
          />
        ) : (
          <Avatar
            size={44}
            name={pubkey}
            variant="beam"
            square={true}
            colors={['#FEE2E2', '#FEF3C7', '#F59E0B', '#EC4899', '#D946EF', '#8B5CF6']}
          />
        )}
      </div>
      <div className="flex w-full flex-1 items-start justify-between">
        <div className="flex w-full justify-between">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="font-bold leading-tight">{profile?.name}</span>
            <span className="leading-tight text-zinc-500">·</span>
            <span className="text-zinc-500">{dayjs().to(dayjs.unix(time))}</span>
          </div>
          <div>
            <button className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-800">
              <DotsHorizontalIcon className="h-3 w-3 text-zinc-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
