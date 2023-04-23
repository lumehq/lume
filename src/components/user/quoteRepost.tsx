import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfileMetadata } from '@utils/hooks/useProfileMetadata';
import { shortenKey } from '@utils/shortenKey';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const UserQuoteRepost = ({ pubkey, time }: { pubkey: string; time: number }) => {
  const profile = useProfileMetadata(pubkey);

  return (
    <div className="group flex items-center gap-2">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-white">
        <img src={profile?.picture || DEFAULT_AVATAR} alt={pubkey} className="h-11 w-11 rounded-md object-cover" />
      </div>
      <div className="flex items-baseline gap-2 text-sm">
        <h5 className="font-semibold leading-tight group-hover:underline">
          {profile?.display_name || profile?.name || shortenKey(pubkey)}{' '}
          <span className="bg-gradient-to-r from-fuchsia-300 via-orange-100 to-amber-300 bg-clip-text text-transparent">
            reposted
          </span>
        </h5>
        <span className="leading-tight text-zinc-500">·</span>
        <span className="text-zinc-500">{dayjs().to(dayjs.unix(time))}</span>
      </div>
    </div>
  );
};
