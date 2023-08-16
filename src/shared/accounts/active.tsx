import { Link } from 'react-router-dom';

import { Image } from '@shared/image';
import { NetworkStatusIndicator } from '@shared/networkStatusIndicator';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';

export function ActiveAccount({ data }: { data: { pubkey: string; npub: string } }) {
  const { status, user } = useProfile(data.pubkey);

  if (status === 'loading') {
    return <div className="h-9 w-9 animate-pulse rounded-md bg-white/50" />;
  }

  return (
    <Link to={`/users/${data.pubkey}`} className="relative inline-block h-9 w-9">
      <Image
        src={user?.picture || user?.image}
        fallback={DEFAULT_AVATAR}
        alt={data.npub}
        className="h-9 w-9 rounded-md object-cover"
      />
      <NetworkStatusIndicator />
    </Link>
  );
}
