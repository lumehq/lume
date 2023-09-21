import { NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { SettingsIcon } from '@shared/icons';
import { Image } from '@shared/image';
import { Logout } from '@shared/logout';

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
          return await sendNativeNotification("You've a new follower");
        case NDKKind.Repost:
          return await sendNativeNotification('Repost');
        case NDKKind.Reaction:
          return await sendNativeNotification('Reaction');
        case NDKKind.Zap:
          return await sendNativeNotification('Zap');
        default:
          break;
      }
    });
  }, []);

  if (status === 'loading') {
    return (
      <div className="inline-flex h-16 items-center gap-2.5 border-l-2 border-transparent pb-2 pl-4 pr-2">
        <div className="relative h-10 w-10 shrink-0 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
        <div className="h-2.5 w-2/3 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
      </div>
    );
  }

  return (
    <div className="flex h-16 items-center justify-between border-l-2 border-transparent pb-2 pl-4 pr-3">
      <Link to={`/users/${db.account.pubkey}`} className="flex items-center gap-1.5">
        <Image
          src={user?.picture || user?.image}
          alt={db.account.npub}
          className="h-9 w-9 shrink-0 rounded-lg object-cover"
        />
        <div className="flex w-full flex-1 flex-col items-start gap-0.5">
          <p className="max-w-[10rem] truncate font-semibold leading-none text-white">
            {user?.name || user?.display_name}
          </p>
          <span className="max-w-[7rem] truncate text-sm leading-none text-white/50">
            {user?.nip05 || displayNpub(db.account.pubkey, 12)}
          </span>
        </div>
      </Link>
      <div className="inline-flex divide-x divide-white/5 rounded-lg border-t border-white/10 bg-white/20">
        <Link
          to="/settings/"
          className="inline-flex h-9 w-9 items-center justify-center hover:bg-white/10"
        >
          <SettingsIcon className="h-4 w-4 text-white" />
        </Link>
        <Logout />
      </div>
    </div>
  );
}
