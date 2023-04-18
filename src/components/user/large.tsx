import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfileMetadata } from '@utils/hooks/useProfileMetadata';
import { shortenKey } from '@utils/shortenKey';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MoreHoriz } from 'iconoir-react';

dayjs.extend(relativeTime);

export const UserLarge = ({ pubkey, time }: { pubkey: string; time: number }) => {
  const profile = useProfileMetadata(pubkey);

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-white">
        <ImageWithFallback
          src={profile?.picture || DEFAULT_AVATAR}
          alt={pubkey}
          fill={true}
          className="rounded-md border border-white/10 object-cover"
        />
      </div>
      <div className="w-full flex-1">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-bold leading-tight text-zinc-100">
              {profile?.display_name || profile?.name || shortenKey(pubkey)}
            </span>
            <span className="leading-tight text-zinc-400">
              {profile?.username || shortenKey(pubkey)} · {dayjs().to(dayjs.unix(time))}
            </span>
          </div>
          <div>
            <button className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-800">
              <MoreHoriz width={12} height={12} className="text-zinc-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
