import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

export function UserReply({ pubkey }: { pubkey: string }) {
  const { user, isError, isLoading } = useProfile(pubkey);

  return (
    <div className="group flex items-start gap-2">
      {isError || isLoading ? (
        <>
          <div className="relative h-9 w-9 shrink animate-pulse overflow-hidden rounded bg-zinc-800" />
          <span className="h-2 w-10 animate-pulse rounded bg-zinc-800 text-base font-medium leading-none text-zinc-500" />
        </>
      ) : (
        <>
          <div className="relative h-9 w-9 shrink overflow-hidden rounded">
            <Image
              src={user?.image}
              fallback={DEFAULT_AVATAR}
              alt={pubkey}
              className="h-9 w-9 rounded object-cover"
            />
          </div>
          <span className="max-w-[10rem] truncate text-sm font-medium leading-none text-zinc-500">
            Replying to {user?.name || shortenKey(pubkey)}
          </span>
        </>
      )}
    </div>
  );
}
