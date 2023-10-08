import { NDKEvent } from '@nostr-dev-kit/ndk';
import * as Avatar from '@radix-ui/react-avatar';
import { minidenticon } from 'minidenticons';
import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { useDecryptMessage } from '@app/chats/hooks/useDecryptMessage';

import { useStorage } from '@libs/storage/provider';

import { useStronghold } from '@stores/stronghold';

import { formatCreatedAt } from '@utils/createdAt';
import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export const ChatListItem = memo(function ChatListItem({ event }: { event: NDKEvent }) {
  const { db } = useStorage();
  const { status, user } = useProfile(event.pubkey);

  const privkey = useStronghold((state) => state.privkey);
  const decryptedContent = useDecryptMessage(event, db.account.pubkey, privkey);

  const createdAt = formatCreatedAt(event.created_at, true);
  const svgURI =
    'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(event.pubkey, 90, 50));

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2.5 rounded-md px-3">
        <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-white/10 backdrop-blur-xl" />
        <div className="flex w-full flex-col">
          <div className="h-2.5 w-1/2 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
          <div className="h-2.5 w-full animate-pulse rounded bg-white/10 backdrop-blur-xl" />
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
          'flex items-center gap-2.5 px-3 py-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800',
          isActive
            ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
            : 'text-zinc-500 dark:text-zinc-300'
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
        <div className="max-w-[10rem] truncate font-semibold text-zinc-900 dark:text-zinc-100">
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