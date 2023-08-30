import { NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { Image } from '@shared/image';

import { useNostr } from '@utils/hooks/useNostr';
import { useProfile } from '@utils/hooks/useProfile';
import { sendNativeNotification } from '@utils/notification';

export function ActiveAccount() {
  const { db } = useStorage();
  const { status, user } = useProfile(db.account.pubkey);
  const { sub } = useNostr();

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
    <Link
      to={`/users/${db.account.pubkey}`}
      className="flex h-10 items-center gap-2.5 rounded-r-lg border-l-2 border-transparent pl-4 pr-2"
    >
      <Image
        src={user?.picture || user?.image}
        alt={db.account.npub}
        className="h-7 w-7 shrink-0 rounded object-cover"
      />
      <p className="text-white/80">Your profile</p>
    </Link>
  );
}
