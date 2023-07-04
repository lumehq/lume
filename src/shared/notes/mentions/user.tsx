import { Link } from 'react-router-dom';

import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

export function MentionUser({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);

  return (
    <Link
      to={`/app/user/${pubkey}`}
      className="font-normal text-fuchsia-500 no-underline hover:text-fuchsia-600"
    >
      @{user?.name || user?.displayName || shortenKey(pubkey)}
    </Link>
  );
}
