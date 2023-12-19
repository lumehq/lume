import * as Avatar from '@radix-ui/react-avatar';
import { minidenticon } from 'minidenticons';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useArk } from '@libs/ark';
import { AccountMoreActions } from '@shared/accounts/more';
import { useNetworkStatus } from '@utils/hooks/useNetworkStatus';
import { useProfile } from '@utils/hooks/useProfile';

export function ActiveAccount() {
  const ark = useArk();
  const { user } = useProfile(ark.account.pubkey);

  const isOnline = useNetworkStatus();

  const svgURI =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(minidenticon(ark.account.pubkey, 90, 50));

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-black/10 p-1 ring-1 ring-transparent hover:bg-black/20 hover:ring-blue-500 dark:bg-white/10 dark:hover:bg-white/20">
      <Link to="/settings/" className="relative inline-block">
        <Avatar.Root>
          <Avatar.Image
            src={user?.picture || user?.image}
            alt={ark.account.pubkey}
            loading="lazy"
            decoding="async"
            style={{ contentVisibility: 'auto' }}
            className="aspect-square h-auto w-full rounded-md object-cover"
          />
          <Avatar.Fallback delayMs={150}>
            <img
              src={svgURI}
              alt={ark.account.pubkey}
              className="aspect-square h-auto w-full rounded-md bg-black dark:bg-white"
            />
          </Avatar.Fallback>
        </Avatar.Root>
        <span
          className={twMerge(
            'absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-neutral-100 dark:ring-neutral-900',
            isOnline ? 'bg-teal-500' : 'bg-red-500'
          )}
        />
      </Link>
      <AccountMoreActions />
    </div>
  );
}
