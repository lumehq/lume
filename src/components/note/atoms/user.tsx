import { DatabaseContext } from '@components/contexts/database';
import { ImageWithFallback } from '@components/imageWithFallback';

import { truncate } from '@utils/truncate';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import Avatar from 'boring-avatars';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import Moment from 'react-moment';

export const User = memo(function User({ pubkey, time }: { pubkey: string; time: any }) {
  const { db }: any = useContext(DatabaseContext);
  const [profile, setProfile] = useState({ picture: null, name: null, username: null });

  const insertCacheProfile = useCallback(
    async (event) => {
      const metadata: any = JSON.parse(event.content);

      await db.execute(
        `INSERT OR IGNORE INTO cache_profiles (id, metadata) VALUES ("${pubkey}", '${JSON.stringify(metadata)}')`
      );
      setProfile(metadata);
    },
    [db, pubkey]
  );

  const getCacheProfile = useCallback(async () => {
    const result: any = await db.select(`SELECT metadata FROM cache_profiles WHERE id = "${pubkey}"`);
    return result;
  }, [db, pubkey]);

  useEffect(() => {
    getCacheProfile()
      .then((res) => {
        if (res[0] !== undefined) {
          setProfile(JSON.parse(res[0].metadata));
        } else {
          fetch(`https://rbr.bio/${pubkey}/metadata.json`).then((res) =>
            res.json().then((res) => {
              // update state
              setProfile(JSON.parse(res.content));
              // save profile to database
              insertCacheProfile(res);
            })
          );
        }
      })
      .catch(console.error);
  }, [getCacheProfile, insertCacheProfile, pubkey]);

  return (
    <div className="relative flex items-start gap-4">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-full border border-white/10">
        {profile.picture ? (
          <ImageWithFallback src={profile.picture} alt={pubkey} fill={true} className="rounded-full object-cover" />
        ) : (
          <Avatar
            size={44}
            name={pubkey}
            variant="beam"
            colors={['#FEE2E2', '#FEF3C7', '#F59E0B', '#EC4899', '#D946EF', '#8B5CF6']}
          />
        )}
      </div>
      <div className="flex w-full flex-1 items-start justify-between">
        <div className="flex w-full justify-between">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="font-bold leading-tight">
              {profile.name ? profile.name : truncate(pubkey, 16, ' .... ')}
            </span>
            <span className="leading-tight text-zinc-500">·</span>
            <Moment fromNow unix className="text-zinc-500">
              {time}
            </Moment>
          </div>
          <div>
            <DotsHorizontalIcon className="h-4 w-4 text-zinc-500" />
          </div>
        </div>
      </div>
    </div>
  );
});
