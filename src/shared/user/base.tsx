import { DEFAULT_AVATAR } from '@lume/stores/constants';
import { useProfile } from '@lume/utils/hooks/useProfile';
import { shortenKey } from '@lume/utils/shortenKey';

import { memo } from 'react';

export const UserBase = memo(function UserBase({ pubkey }: { pubkey: string }) {
  const profile = useProfile(pubkey);

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-full border border-white/10">
        <img
          src={profile?.picture || DEFAULT_AVATAR}
          alt={pubkey}
          className="h-11 w-11 rounded-full object-cover"
          loading="lazy"
          fetchpriority="high"
        />
      </div>
      <div className="flex w-full flex-1 flex-col items-start text-start">
        <span className="truncate font-medium leading-tight text-zinc-200">
          {profile?.display_name || profile?.name}
        </span>
        <span className="text-sm leading-tight text-zinc-400">{shortenKey(pubkey)}</span>
      </div>
    </div>
  );
});
