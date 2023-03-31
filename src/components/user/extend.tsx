import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { createCacheProfile, getCacheProfile } from '@utils/storage';
import { truncate } from '@utils/truncate';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { fetch } from '@tauri-apps/api/http';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import destr from 'destr';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useState } from 'react';

dayjs.extend(relativeTime);

export const UserExtend = memo(function UserExtend({ pubkey, time }: { pubkey: string; time: any }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  const openUserPage = (e) => {
    e.stopPropagation();
    router.push(`/users/${pubkey}`);
  };

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
        setProfile(destr(res.metadata));
      } else {
        fetchProfile(pubkey)
          .then((res: any) => {
            setProfile(destr(res.content));
            createCacheProfile(pubkey, res.content);
          })
          .catch(console.error);
      }
    });
  }, [fetchProfile, pubkey]);

  return (
    <div className="group flex items-start gap-2">
      <div
        onClick={(e) => openUserPage(e)}
        className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-zinc-900 ring-fuchsia-500 ring-offset-1 ring-offset-zinc-900 group-hover:ring-1"
      >
        <ImageWithFallback
          src={profile?.picture || DEFAULT_AVATAR}
          alt={pubkey}
          fill={true}
          className="rounded-md border border-white/10 object-cover"
        />
      </div>
      <div className="flex w-full flex-1 items-start justify-between">
        <div className="flex w-full justify-between">
          <div className="flex items-baseline gap-2 text-sm">
            <span onClick={(e) => openUserPage(e)} className="font-bold leading-tight group-hover:underline">
              {profile?.display_name || profile?.name || truncate(pubkey, 16, ' .... ')}
            </span>
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
