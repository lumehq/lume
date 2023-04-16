import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfileMetadata } from '@utils/hooks/useProfileMetadata';
import { truncate } from '@utils/truncate';

export const UserMini = ({ pubkey }: { pubkey: string }) => {
  const profile = useProfileMetadata(pubkey);

  return (
    <div className="group flex items-start gap-1">
      <div className="relative h-7 w-7 shrink overflow-hidden rounded border border-white/10">
        <ImageWithFallback
          src={profile?.picture || DEFAULT_AVATAR}
          alt={pubkey}
          fill={true}
          className="rounded object-cover"
        />
      </div>
      <span className="text-xs font-medium leading-none text-zinc-500">
        Replying to {profile?.name || truncate(pubkey, 16, ' .... ')}
      </span>
    </div>
  );
};
