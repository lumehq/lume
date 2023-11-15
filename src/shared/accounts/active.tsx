import * as Avatar from '@radix-ui/react-avatar';
import { minidenticon } from 'minidenticons';
import { Link } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { AccountMoreActions } from '@shared/accounts/more';
import { NetworkStatusIndicator } from '@shared/networkStatusIndicator';

import { useProfile } from '@utils/hooks/useProfile';

export function ActiveAccount() {
  const { db } = useStorage();
  const { status, user } = useProfile(db.account.pubkey);

  const svgURI =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(minidenticon(db.account.pubkey, 90, 50));

  if (status === 'pending') {
    return (
      <div className="aspect-square h-auto w-full animate-pulse rounded-lg bg-neutral-300 dark:bg-neutral-700" />
    );
  }

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-neutral-100 p-1 ring-1 ring-transparent hover:bg-neutral-200 hover:ring-blue-500 dark:bg-neutral-900 dark:hover:bg-neutral-800">
      <Link to="/settings/" className="relative inline-block">
        <Avatar.Root>
          <Avatar.Image
            src={user?.picture || user?.image}
            alt={db.account.pubkey}
            loading="lazy"
            decoding="async"
            style={{ contentVisibility: 'auto' }}
            className="aspect-square h-auto w-full rounded-md"
          />
          <Avatar.Fallback delayMs={150}>
            <img
              src={svgURI}
              alt={db.account.pubkey}
              className="aspect-square h-auto w-full rounded-md bg-black dark:bg-white"
            />
          </Avatar.Fallback>
        </Avatar.Root>
        <NetworkStatusIndicator />
      </Link>
      <AccountMoreActions />
    </div>
  );
}
