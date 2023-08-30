import { Image } from '@shared/image';

import { useProfile } from '@utils/hooks/useProfile';

export function MiniUser({ pubkey }: { pubkey: string }) {
  const { status, user } = useProfile(pubkey);

  if (status === 'loading') {
    return <div className="h-4 w-4 animate-pulse rounded bg-white/10"></div>;
  }

  return (
    <Image
      src={user?.picture || user?.image}
      alt={pubkey}
      className="relative z-20 inline-block h-4 w-4 rounded ring-1 ring-black"
    />
  );
}
