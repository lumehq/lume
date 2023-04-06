import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useMetadata } from '@utils/metadata';
import { truncate } from '@utils/truncate';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const UserExtend = ({ pubkey, time }: { pubkey: string; time: number }) => {
  const profile = useMetadata(pubkey);

  return (
    <div className="group flex items-start gap-2">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-zinc-900 ring-fuchsia-500 ring-offset-1 ring-offset-zinc-900 group-hover:ring-1">
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
            <span className="font-bold leading-tight group-hover:underline">
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
};
