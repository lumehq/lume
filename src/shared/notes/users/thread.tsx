import { Image } from '@shared/image';

import { formatCreatedAt } from '@utils/createdAt';
import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function ThreadUser({ pubkey, time }: { pubkey: string; time: number }) {
  const { status, user } = useProfile(pubkey);
  const createdAt = formatCreatedAt(time);

  if (status === 'loading') {
    return <div className="h-4 w-4 animate-pulse rounded bg-white/10"></div>;
  }

  return (
    <div className="flex items-center gap-3">
      <Image
        src={user.picture || user.image}
        alt={pubkey}
        className="relative z-20 inline-block h-11 w-11 rounded-lg"
      />
      <div className="flex flex-1 flex-col gap-2">
        <h5 className="max-w-[15rem] truncate font-semibold leading-none text-white">
          {user.display_name || user.name}
        </h5>
        <div className="inline-flex items-center gap-2">
          <span className="leading-none text-white/50">{createdAt}</span>
          <span className="leading-none text-white/50">·</span>
          <span className="leading-none text-white/50">{displayNpub(pubkey, 16)}</span>
        </div>
      </div>
    </div>
  );
}
