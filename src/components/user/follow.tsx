import { ImageWithFallback } from '@components/imageWithFallback';

import { createCacheProfile } from '@utils/storage';
import { truncate } from '@utils/truncate';

import { fetch } from '@tauri-apps/api/http';
import destr from 'destr';
import { memo, useCallback, useEffect, useState } from 'react';

export const UserFollow = memo(function UserFollow({ pubkey }: { pubkey: string }) {
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async (id: string) => {
    const res = await fetch(`https://rbr.bio/${id}/metadata.json`, {
      method: 'GET',
      timeout: 30,
    });
    return res.data;
  }, []);

  useEffect(() => {
    fetchProfile(pubkey)
      .then((res: any) => {
        setProfile(destr(res.content));
        createCacheProfile(res.pubkey, res.content);
      })
      .catch(console.error);
  }, [fetchProfile, pubkey]);

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-full border border-white/10">
        {profile?.picture && (
          <ImageWithFallback src={profile.picture} alt={pubkey} fill={true} className="rounded-full object-cover" />
        )}
      </div>
      <div className="flex w-full flex-1 flex-col items-start text-start">
        <span className="truncate font-medium leading-tight text-zinc-200">
          {profile?.display_name || profile?.name}
        </span>
        <span className="text-sm leading-tight text-zinc-400">{truncate(pubkey, 16, ' .... ')}</span>
      </div>
    </div>
  );
});
