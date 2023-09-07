import { NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { useEffect } from 'react';

import { useStorage } from '@libs/storage/provider';

import { AccountMoreActions } from '@shared/accounts/more';
import { Image } from '@shared/image';

import { useActivities } from '@stores/activities';

import { useNostr } from '@utils/hooks/useNostr';
import { useProfile } from '@utils/hooks/useProfile';
import { sendNativeNotification } from '@utils/notification';
import { displayNpub } from '@utils/shortenKey';

export function ActiveAccount() {
  const { db } = useStorage();
  const { status, user } = useProfile(db.account.pubkey);
  const { sub } = useNostr();

  const addActivity = useActivities((state) => state.addActivity);

  useEffect(() => {
    const filter: NDKFilter = {
      '#p': [db.account.pubkey],
      kinds: [
        NDKKind.Text,
        NDKKind.Contacts,
        NDKKind.Repost,
        NDKKind.Reaction,
        NDKKind.Zap,
      ],
      since: Math.floor(Date.now() / 1000),
    };

    sub(filter, async (event) => {
      addActivity(event);

      switch (event.kind) {
        case NDKKind.Text:
          return await sendNativeNotification('Mention');
        case NDKKind.Contacts:
          return await sendNativeNotification("You've new follower");
        case NDKKind.Repost:
          return await sendNativeNotification('Repost');
        case NDKKind.Reaction:
          return await sendNativeNotification('Reaction');
        case NDKKind.Zap:
          return await sendNativeNotification('Zap');
        default:
          console.log('[notify] new event: ', event);
          break;
      }
    });
  }, []);

  if (status === 'loading') {
    return (
      <div className="inline-flex h-10 items-center gap-2.5 rounded-md px-2">
        <div className="relative h-7 w-7 shrink-0 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
        <div className="h-2.5 w-2/3 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
      </div>
    );
  }

  return (
    <div className="flex h-16 items-center justify-between border-l-2 border-transparent pb-2 pl-4 pr-2">
      <div className="flex items-center gap-2.5">
        <Image
          src={user?.picture || user?.image}
          alt={db.account.npub}
          className="h-10 w-10 shrink-0 rounded-lg object-cover"
        />
        <div className="flex w-full flex-1 flex-col items-start gap-1.5">
          <p className="max-w-[10rem] truncate font-bold leading-none text-white">
            {user?.name || user?.display_name}
          </p>
          <span className="max-w-[8rem] truncate text-sm leading-none text-white/50">
            {displayNpub(db.account.pubkey, 16)}
          </span>
        </div>
      </div>
      <AccountMoreActions pubkey={db.account.pubkey} />
    </div>
  );
}
