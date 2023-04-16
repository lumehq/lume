import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfileMetadata } from '@utils/hooks/useProfileMetadata';
import { truncate } from '@utils/truncate';

import { memo } from 'react';

export const UserBase = memo(function UserBase({ pubkey }: { pubkey: string }) {
  const profile = useProfileMetadata(pubkey);

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-full border border-white/10">
        <ImageWithFallback
          src={profile?.picture || DEFAULT_AVATAR}
          alt={pubkey}
          fill={true}
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex w-full flex-1 flex-col items-start text-start">
        <span className="truncate font-medium leading-tight text-zinc-200">
          {profile?.display_name || profile?.name}
        </span>
        <span className="text-sm leading-tight text-zinc-400">{truncate(pubkey, 16, ' .... ')}</span>
      </div>
    </div>
  );
});
