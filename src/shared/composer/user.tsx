import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';

export function ComposerUser({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);

  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded bg-zinc-900">
        <Image
          src={user?.picture || user?.image}
          fallback={DEFAULT_AVATAR}
          alt={pubkey}
          className="h-8 w-8 object-cover"
        />
      </div>
      <h5 className="text-base font-semibold leading-none text-zinc-100">
        {user?.nip05 || user?.name || (
          <div className="h-3 w-20 animate-pulse rounded-sm bg-zinc-700" />
        )}
      </h5>
    </div>
  );
}
