import { Image } from '@shared/image';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function UserImport({ pubkey }: { pubkey: string }) {
  const { status, user } = useProfile(pubkey);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2.5">
        <div className="12 12 relative shrink-0 animate-pulse rounded-lg bg-white/10 backdrop-blur-xl" />
        <div className="flex flex-col gap-1">
          <span className="h-5 w-1/2 animate-pulse rounded bg-white/10" />
          <span className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <Image
        src={user?.picture || user?.image}
        alt={pubkey}
        className="h-12 w-12 shrink-0 rounded-lg object-cover"
      />
      <div className="flex w-full flex-col gap-1">
        <h3 className="max-w-[15rem] truncate text-lg font-semibold leading-none text-white">
          {user?.name || user?.display_name}
        </h3>
        <p className="leading-none text-white/70">
          {user?.nip05 || user?.username || displayNpub(pubkey, 16)}
        </p>
      </div>
    </div>
  );
}
