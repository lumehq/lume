import { Image } from '@shared/image';

import { DEFAULT_AVATAR, IMGPROXY_URL } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

export default function UserReply({ pubkey }: { pubkey: string }) {
  const { user, isError, isLoading } = useProfile(pubkey);

  return (
    <div className="group flex items-start gap-1">
      {isError || isLoading ? (
        <>
          <div className="relative h-7 w-7 shrink animate-pulse overflow-hidden rounded bg-zinc-800"></div>
          <span className="h-2 w-10 animate-pulse rounded bg-zinc-800 text-xs font-medium leading-none text-zinc-500"></span>
        </>
      ) : (
        <>
          <div className="relative h-7 w-7 shrink overflow-hidden rounded">
            <Image
              src={`${IMGPROXY_URL}/rs:fit:100:100/plain/${user?.picture ? user.picture : DEFAULT_AVATAR}`}
              alt={pubkey}
              className="h-7 w-7 rounded object-cover"
            />
          </div>
          <span className="text-xs font-medium leading-none text-zinc-500">
            Replying to {user?.name || shortenKey(pubkey)}
          </span>
        </>
      )}
    </div>
  );
}
