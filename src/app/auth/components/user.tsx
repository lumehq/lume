import { Image } from '@shared/image';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function User({ pubkey, fallback }: { pubkey: string; fallback?: string }) {
  const { status, user } = useProfile(pubkey, fallback);

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
    <div className="flex items-center gap-2.5">
      <Image
        src={user?.picture || user?.image}
        alt={pubkey}
        className="h-10 w-10 shrink-0 rounded-lg object-cover"
      />
      <div className="flex w-full flex-1 flex-col items-start text-start">
        <p className="max-w-[15rem] truncate font-medium leading-tight text-white">
          {user?.name || user?.display_name || user?.nip05}
        </p>
        <span className="max-w-[15rem] truncate leading-tight text-white/50">
          {displayNpub(pubkey, 16)}
        </span>
      </div>
    </div>
  );
}
