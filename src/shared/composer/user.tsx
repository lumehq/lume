import { Image } from '@shared/image';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function ComposerUser({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);

  return (
    <div className="flex items-center gap-3">
      <Image
        src={user?.picture || user?.image}
        alt={pubkey}
        className="h-10 w-10 shrink-0 rounded-lg"
      />
      <h5 className="text-base font-semibold leading-none text-white">
        {user?.name || user?.display_name || user?.displayName || displayNpub(pubkey, 16)}
      </h5>
    </div>
  );
}
