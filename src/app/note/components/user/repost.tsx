import { Image } from '@lume/shared/image';
import { DEFAULT_AVATAR, IMGPROXY_URL } from '@lume/stores/constants';
import { useProfile } from '@lume/utils/hooks/useProfile';
import { shortenKey } from '@lume/utils/shortenKey';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const NoteRepostUser = ({ pubkey, time }: { pubkey: string; time: number }) => {
  const { user } = useProfile(pubkey);

  return (
    <div className="group flex items-center gap-2">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-zinc-900">
        <Image
          src={`${IMGPROXY_URL}/rs:fit:100:100/plain/${user?.picture ? user.picture : DEFAULT_AVATAR}`}
          alt={pubkey}
          className="h-11 w-11 rounded-md object-cover"
        />
      </div>
      <div className="flex items-baseline gap-2 text-sm">
        <h5 className="font-semibold leading-tight group-hover:underline">
          {user?.display_name || user?.name || shortenKey(pubkey)}{' '}
          <span className="bg-gradient-to-r from-fuchsia-300 via-orange-100 to-amber-300 bg-clip-text text-transparent">
            reposted
          </span>
        </h5>
        <span className="leading-tight text-zinc-500">·</span>
        <span className="text-zinc-500">{dayjs().to(dayjs.unix(time), true)}</span>
      </div>
    </div>
  );
};
