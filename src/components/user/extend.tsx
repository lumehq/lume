import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfileMetadata } from '@utils/hooks/useProfileMetadata';
import { shortenKey } from '@utils/shortenKey';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const UserExtend = ({ pubkey, time }: { pubkey: string; time: number }) => {
  const profile = useProfileMetadata(pubkey);

  return (
    <div className="group flex h-11 items-center gap-2">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-white">
        <img src={profile?.picture || DEFAULT_AVATAR} alt={pubkey} className="h-11 w-11 rounded-md object-cover" />
      </div>
      <div className="flex w-full flex-1 items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <h5 className="text-sm font-semibold leading-none group-hover:underline">
              {profile?.display_name || profile?.name || shortenKey(pubkey)}
            </h5>
            <span className="text-sm leading-none text-zinc-700"></span>
          </div>
          <span className="text-sm leading-none text-zinc-500">
            {profile?.nip05 || shortenKey(pubkey)} • {dayjs().to(dayjs.unix(time))}
          </span>
        </div>
      </div>
    </div>
  );
};
