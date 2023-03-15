import { DatabaseContext } from '@components/contexts/database';
import { ImageWithFallback } from '@components/imageWithFallback';

import { truncate } from '@utils/truncate';

import Avatar from 'boring-avatars';
import { memo, useCallback, useContext, useEffect, useState } from 'react';

export const UserBase = memo(function UserBase({ pubkey }: { pubkey: string }) {
  const { db }: any = useContext(DatabaseContext);
  const [profile, setProfile] = useState({ picture: null, display_name: null, name: null });

  const cacheProfile = useCallback(
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

  useEffect(() => {
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
      .then((data) => cacheProfile(data))
      .catch((error) => console.log('error is', error));
  }, [cacheProfile, pubkey]);

  return (
    <div className="flex items-center gap-2">
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
      <div className="flex w-full flex-1 flex-col items-start">
        <span className="font-medium leading-tight text-zinc-200">
          {profile.display_name ? profile.display_name : truncate(pubkey, 16, ' .... ')}
        </span>
        <span className="text-sm leading-tight text-zinc-400">{profile.name}</span>
      </div>
    </div>
  );
});
