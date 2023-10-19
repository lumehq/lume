import { NDKEvent } from '@nostr-dev-kit/ndk';
import { Link } from 'react-router-dom';

import { NotiUser } from '@app/notifications/components/user';

import { useStorage } from '@libs/storage/provider';

import { formatCreatedAt } from '@utils/createdAt';

export function NotiRepost({ event }: { event: NDKEvent }) {
  const { db } = useStorage();

  const createdAt = formatCreatedAt(event.created_at);
  const rootId = event.tags.find((el) => el[0])?.[1];

  return (
    <Link to={`/notes/text/${rootId}`} className="h-min w-full px-3">
      <div className="group flex items-center justify-between rounded-xl px-3 py-3 hover:bg-white/10">
        <div className="flex items-center gap-2">
          <NotiUser pubkey={event.pubkey} />
          <p className="leading-none text-neutral-600 dark:text-neutral-400">
            repost{' '}
            {event.pubkey !== db.account.pubkey ? 'a post that mention you' : 'your post'}{' '}
            · {createdAt}
          </p>
        </div>
        <span className="hidden text-sm font-semibold text-blue-500 group-hover:block">
          View
        </span>
      </div>
    </Link>
  );
}
