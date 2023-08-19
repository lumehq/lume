import { Image } from '@shared/image';

import { useProfile } from '@utils/hooks/useProfile';

export function ComposerUser({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);

  return (
    <div className="flex items-center gap-3">
      <Image
        src={user?.picture || user?.image}
        alt={pubkey}
        className="h-8 w-8 shrink-0 rounded-md object-cover"
      />
      <h5 className="text-base font-semibold leading-none text-white">
        {user?.nip05 || user?.name || (
          <div className="h-3 w-20 animate-pulse rounded-sm bg-zinc-700" />
        )}
      </h5>
    </div>
  );
}
