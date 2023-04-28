import { DEFAULT_AVATAR, IMGPROXY_URL } from '@lume/stores/constants';
import { useProfile } from '@lume/utils/hooks/useProfile';
import { shortenKey } from '@lume/utils/shortenKey';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const NoteDefaultUser = ({ pubkey, time }: { pubkey: string; time: number }) => {
  const { user, isError, isLoading } = useProfile(pubkey);

  return (
    <div className="group flex h-11 items-center gap-2">
      {isError || isLoading ? (
        <>
          <div className="relative h-11 w-11 shrink animate-pulse overflow-hidden rounded-md bg-white bg-zinc-800"></div>
          <div className="flex w-full flex-1 items-start justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <div className="h-4 w-20 animate-pulse rounded bg-zinc-800"></div>
              </div>
              <div className="h-2.5 w-14 animate-pulse rounded bg-zinc-800"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-white">
            <img
              src={`${IMGPROXY_URL}/rs:fit:100:100/plain/${user?.picture ? user.picture : DEFAULT_AVATAR}`}
              alt={pubkey}
              className="h-11 w-11 rounded-md object-cover"
              loading="lazy"
              fetchpriority="high"
            />
          </div>
          <div className="flex w-full flex-1 items-start justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <h5 className="text-sm font-semibold leading-none group-hover:underline">
                  {user?.display_name || user?.name || shortenKey(pubkey)}
                </h5>
              </div>
              <span className="text-sm leading-none text-zinc-500">
                {user?.nip05 || shortenKey(pubkey)} • {dayjs().to(dayjs.unix(time))}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
