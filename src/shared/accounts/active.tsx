import { NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { Image } from '@shared/image';
import { NetworkStatusIndicator } from '@shared/networkStatusIndicator';

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
    return <div className="h-9 w-9 animate-pulse rounded-md bg-white/50" />;
  }

  return (
    <Link to={`/users/${db.account.pubkey}`} className="relative inline-block shrink-0">
      <Image
        src={user?.picture || user?.image}
        alt={db.account.npub}
        className="h-10 w-10 rounded-lg object-cover"
      />
      <NetworkStatusIndicator />
    </Link>
  );
}
