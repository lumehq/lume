import { Image } from '@shared/image';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function UserRelay({ pubkey }: { pubkey: string }) {
  const { status, user } = useProfile(pubkey);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="relative h-10 w-10 shrink-0 animate-pulse rounded-md bg-white/10 backdrop-blur-xl" />
        <div className="flex w-full flex-1 flex-col items-start gap-1 text-start">
          <span className="h-4 w-1/2 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
          <span className="h-3 w-1/3 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 text-white/50">
      <span className="text-sm">Use by</span>
      <div className="inline-flex items-center gap-1">
        <Image
          src={user?.picture || user?.image}
          alt={pubkey}
          className="h-5 w-5 shrink-0 rounded object-cover"
        />
        <span className="truncate text-sm font-medium leading-none text-white">
          {user?.name || user?.display_name || user?.nip05 || displayNpub(pubkey, 16)}
        </span>
      </div>
    </div>
  );
}
