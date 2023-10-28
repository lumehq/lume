import { NDKEvent } from '@nostr-dev-kit/ndk';
import * as Avatar from '@radix-ui/react-avatar';
import { minidenticon } from 'minidenticons';
import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { useDecryptMessage } from '@app/chats/hooks/useDecryptMessage';

import { formatCreatedAt } from '@utils/createdAt';
import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export const ChatListItem = memo(function ChatListItem({ event }: { event: NDKEvent }) {
  const { status, user } = useProfile(event.pubkey);
  const decryptedContent = useDecryptMessage(event);

  const createdAt = formatCreatedAt(event.created_at, true);
  const svgURI =
    'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(event.pubkey, 90, 50));

  if (status === 'pending') {
    return (
      <div className="flex items-center gap-2.5 rounded-md px-3">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-neutral-400 dark:bg-neutral-600" />
        <div className="flex w-full flex-col">
          <div className="h-2.5 w-1/2 animate-pulse rounded bg-neutral-400 dark:bg-neutral-600" />
          <div className="h-2.5 w-full animate-pulse rounded bg-neutral-400 dark:bg-neutral-600" />
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={`/chats/chat/${event.pubkey}`}
      preventScrollReset={true}
      className={({ isActive }) =>
        twMerge(
          'flex items-center gap-2.5 px-3 py-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800',
          isActive
            ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
            : 'text-neutral-500 dark:text-neutral-300'
        )
      }
    >
      <Avatar.Root className="shrink-0">
        <Avatar.Image
          src={user?.picture || user?.image}
          alt={event.pubkey}
          loading="lazy"
          decoding="async"
          style={{ contentVisibility: 'auto' }}
          className="h-10 w-10 rounded-lg"
        />
        <Avatar.Fallback delayMs={300}>
          <img
            src={svgURI}
            alt={event.pubkey}
            className="h-10 w-10 rounded-lg bg-black dark:bg-white"
          />
        </Avatar.Fallback>
      </Avatar.Root>
      <div className="flex w-full flex-col">
        <div className="max-w-[10rem] truncate font-semibold text-neutral-900 dark:text-neutral-100">
          {user?.name ||
            user?.display_name ||
            user?.displayName ||
            displayNpub(event.pubkey, 16)}
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="max-w-[10rem] truncate text-sm">{decryptedContent}</div>
          <div className="text-sm">{createdAt}</div>
        </div>
      </div>
    </NavLink>
  );
});
