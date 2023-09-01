import { Image } from '@shared/image';

import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

export function RepostUser({ pubkey }: { pubkey: string }) {
  const { status, user } = useProfile(pubkey);

  if (status === 'loading') {
    return <div className="h-4 w-4 animate-pulse rounded bg-white/10"></div>;
  }

  return (
    <div className="flex gap-2 pl-6">
      <Image
        src={user?.picture || user?.image}
        alt={pubkey}
        className="relative z-20 inline-block h-6 w-6 rounded bg-white ring-1 ring-black"
      />
      <div className="inline-flex items-baseline gap-1">
        <h5 className="max-w-[18rem] truncate text-white/50">
          {user?.name || user?.display_name || shortenKey(pubkey)}
        </h5>
        <span className="text-white/50">reposted</span>
      </div>
    </div>
  );
}
