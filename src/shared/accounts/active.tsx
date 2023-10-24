import { NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import * as Avatar from '@radix-ui/react-avatar';
import { minidenticon } from 'minidenticons';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { AccountMoreActions } from '@shared/accounts/more';
import { NetworkStatusIndicator } from '@shared/networkStatusIndicator';

import { useActivities } from '@stores/activities';

import { useNostr } from '@utils/hooks/useNostr';
import { useProfile } from '@utils/hooks/useProfile';
import { sendNativeNotification } from '@utils/notification';

export function ActiveAccount() {
  const { db } = useStorage();
  const { status, user } = useProfile(db.account.pubkey);
  const { sub } = useNostr();

  const addActivity = useActivities((state) => state.addActivity);
  const svgURI =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(minidenticon(db.account.pubkey, 90, 50));

  useEffect(() => {
    const filter: NDKFilter = {
      '#p': [db.account.pubkey],
      kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Reaction, NDKKind.Zap],
      since: Math.floor(Date.now() / 1000),
    };

    sub(
      filter,
      async (event) => {
        addActivity(event);
        switch (event.kind) {
          case NDKKind.Text:
            return await sendNativeNotification('Mention');
          case NDKKind.Repost:
            return await sendNativeNotification('Repost');
          case NDKKind.Reaction:
            return await sendNativeNotification('Reaction');
          case NDKKind.Zap:
            return await sendNativeNotification('Zap');
          default:
            break;
        }
      },
      false
    );
  }, []);

  if (status === 'loading') {
    return (
      <div className="aspect-square h-auto w-full animate-pulse rounded-lg bg-neutral-300 dark:bg-neutral-700" />
    );
  }

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-neutral-100 p-1 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800">
      <Link to={`/users/${db.account.pubkey}`} className="relative inline-block">
        <Avatar.Root>
          <Avatar.Image
            src={user?.picture || user?.image}
            alt={db.account.pubkey}
            loading="lazy"
            decoding="async"
            style={{ contentVisibility: 'auto' }}
            className="aspect-square h-auto w-full rounded-md"
          />
          <Avatar.Fallback delayMs={300}>
            <img
              src={svgURI}
              alt={db.account.pubkeypubkey}
              className="aspect-square h-auto w-full rounded-md bg-black dark:bg-white"
            />
          </Avatar.Fallback>
        </Avatar.Root>
        <NetworkStatusIndicator />
      </Link>
      <AccountMoreActions pubkey={db.account.pubkey} />
    </div>
  );
}
