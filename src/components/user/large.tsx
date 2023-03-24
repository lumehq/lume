import { ImageWithFallback } from '@components/imageWithFallback';

import { createCacheProfile, getCacheProfile } from '@utils/storage';
import { truncate } from '@utils/truncate';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { fetch } from '@tauri-apps/api/http';
import Avatar from 'boring-avatars';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { memo, useCallback, useEffect, useState } from 'react';

dayjs.extend(relativeTime);

export const UserLarge = memo(function UserLarge({ pubkey, time }: { pubkey: string; time: any }) {
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async (id: string) => {
    const res = await fetch(`https://rbr.bio/${id}/metadata.json`, {
      method: 'GET',
      timeout: 30,
    });
    return res.data;
  }, []);

  useEffect(() => {
    getCacheProfile(pubkey).then((res) => {
      if (res) {
        setProfile(JSON.parse(res.metadata));
      } else {
        fetchProfile(pubkey)
          .then((res: any) => {
            setProfile(JSON.parse(res.content));
            createCacheProfile(pubkey, res.content);
          })
          .catch(console.error);
      }
    });
  }, [fetchProfile, pubkey]);

  return (
    <div className="flex items-center gap-2">
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
      <div className="w-full flex-1">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-bold leading-tight text-zinc-100">
              {profile?.display_name || profile?.name || truncate(pubkey, 16, ' .... ')}
            </span>
            <span className="leading-tight text-zinc-400">
              {profile?.username || truncate(pubkey, 16, ' .... ')} · {dayjs().to(dayjs.unix(time))}
            </span>
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
