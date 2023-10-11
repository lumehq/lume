import { NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { HorizontalDotsIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { useActivities } from '@stores/activities';

import { useNostr } from '@utils/hooks/useNostr';
import { useProfile } from '@utils/hooks/useProfile';
import { sendNativeNotification } from '@utils/notification';

export function ActiveAccount() {
  const { db } = useStorage();
  const { status, user } = useProfile(db.account.pubkey);
  const { sub } = useNostr();

  const addActivity = useActivities((state) => state.addActivity);

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
      <div className="aspect-square h-auto w-full animate-pulse rounded-lg bg-white/10" />
    );
  }

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-neutral-100 p-1 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800">
      <Link to={`/users/${db.account.pubkey}`} className="relative inline-block">
        <Image
          src={user?.picture || user?.image}
          alt={db.account.npub}
          className="aspect-square h-auto w-full rounded-md"
        />
        <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-neutral-100 dark:ring-neutral-900" />
      </Link>
      <div className="inline-flex items-center justify-center rounded-md">
        <HorizontalDotsIcon className="h-4 w-4" />
      </div>
    </div>
  );
}
