import { Link } from 'react-router-dom';

import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

export function MentionUser({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);

  return (
    <Link
      to={`/app/user/${pubkey}`}
      className="break-words font-normal !text-green-400 no-underline hover:!text-green-500"
    >
      @{user?.name || user?.displayName || shortenKey(pubkey)}
    </Link>
  );
}
