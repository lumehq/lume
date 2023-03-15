import { DatabaseContext } from '@components/contexts/database';
import { ImageWithFallback } from '@components/imageWithFallback';

import { truncate } from '@utils/truncate';

import Avatar from 'boring-avatars';
import { memo, useCallback, useContext, useEffect, useState } from 'react';

export const UserMini = memo(function UserMini({ pubkey }: { pubkey: string }) {
  const { db }: any = useContext(DatabaseContext);
  const [profile, setProfile] = useState({ picture: null, display_name: null });

  const insertCacheProfile = useCallback(
    async (event) => {
      const metadata: any = JSON.parse(event.content);
      // insert to database
      await db.execute(
        `INSERT OR IGNORE INTO cache_profiles (id, metadata) VALUES ("${pubkey}", '${JSON.stringify(metadata)}')`
      );
      // update state
      setProfile(metadata);
    },
    [db, pubkey]
  );

  const getCacheProfile = useCallback(async () => {
    const result: any = await db.select(`SELECT metadata FROM cache_profiles WHERE id = "${pubkey}"`);
    return result[0];
  }, [db, pubkey]);

  useEffect(() => {
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

  return (
    <div className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium hover:bg-zinc-900">
      <div className="relative h-5 w-5 overflow-hidden rounded-full">
        {profile.picture ? (
          <ImageWithFallback src={profile.picture} alt={pubkey} fill={true} className="rounded-full object-cover" />
        ) : (
          <Avatar
            size={20}
            name={pubkey}
            variant="beam"
            colors={['#FEE2E2', '#FEF3C7', '#F59E0B', '#EC4899', '#D946EF', '#8B5CF6']}
          />
        )}
      </div>
      <div className="flex flex-col">
        <p className="leading-tight text-zinc-300">
          {profile.display_name ? profile.display_name : truncate(pubkey, 16, ' .... ')}
        </p>
      </div>
    </div>
  );
});
