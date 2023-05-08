import { Image } from '@lume/shared/image';
import { DEFAULT_AVATAR, IMGPROXY_URL } from '@lume/stores/constants';
import { useProfile } from '@lume/utils/hooks/useProfile';
import { shortenKey } from '@lume/utils/shortenKey';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const NoteDefaultUser = ({ pubkey, time }: { pubkey: string; time: number }) => {
  const { user } = useProfile(pubkey);

  return (
    <div className="group relative z-10 flex items-center gap-2.5">
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-zinc-900">
        <Image
          src={`${IMGPROXY_URL}/rs:fit:100:100/plain/${user?.picture ? user.picture : DEFAULT_AVATAR}`}
          alt={pubkey}
          className="h-9 w-9 object-cover"
        />
      </div>
      <div className="flex w-full flex-1 items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <h5 className="text-sm font-semibold leading-none group-hover:underline">
            {user?.display_name || user?.name || <div className="h-3 w-20 animate-pulse rounded-sm bg-zinc-800"></div>}
          </h5>
          <div className="flex items-baseline gap-1.5 text-sm leading-none text-zinc-500">
            <span>{user?.nip05 || shortenKey(pubkey)}</span>
            <span>•</span>
            <span>{dayjs().to(dayjs.unix(time), true)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
