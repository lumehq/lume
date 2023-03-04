import { ImageWithFallback } from '@components/imageWithFallback';

import { truncate } from '@utils/truncate';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import Avatar from 'boring-avatars';
import { memo, useEffect, useState } from 'react';

export const UserWithUsername = memo(function UserWithUsername({ pubkey }: { pubkey: string }) {
  const [profile, setProfile] = useState({ picture: null, name: null, username: null });

  useEffect(() => {
    fetch(`https://rbr.bio/${pubkey}/metadata.json`).then((res) =>
      res.json().then((res) => {
        // update state
        setProfile(JSON.parse(res.content));
      })
    );
  }, [pubkey]);

  return (
    <div className="relative flex items-start gap-2">
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
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-bold leading-tight">
              {profile.name ? profile.name : truncate(pubkey, 16, ' .... ')}
            </span>
            <span className="text-zinc-500">
              {profile.username ? profile.username : truncate(pubkey, 16, ' .... ')}
            </span>
          </div>
          <div>
            <DotsHorizontalIcon className="h-4 w-4 text-zinc-500" />
          </div>
        </div>
      </div>
    </div>
  );
});
