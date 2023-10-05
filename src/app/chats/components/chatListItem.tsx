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
      <div className="inline-flex h-10 items-center gap-2.5 rounded-md px-3">
        <div className="relative h-7 w-7 shrink-0 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
        <div className="h-2.5 w-2/3 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
      </div>
    );
  }

  return (
    <NavLink
      to={`/chats/chat/${event.pubkey}`}
      preventScrollReset={true}
      className={({ isActive }) =>
        twMerge(
          'flex items-center gap-2.5 px-3 py-1.5 hover:bg-white/10',
          isActive
            ? 'border-fuchsia-500 bg-white/5 text-white'
            : 'border-transparent text-white/70'
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
          className="h-9 w-9 rounded-lg"
        />
        <Avatar.Fallback delayMs={300}>
          <img src={svgURI} alt={event.pubkey} className="h-9 w-9 rounded-lg bg-white" />
        </Avatar.Fallback>
      </Avatar.Root>
      <div className="flex w-full flex-col">
        <h5 className="max-w-[10rem] truncate font-semibold text-white">
          {user?.name ||
            user?.display_name ||
            user?.displayName ||
            displayNpub(event.pubkey, 16)}
        </h5>
        <div className="flex w-full items-center justify-between">
          <p className="max-w-[8rem] truncate text-sm text-white/70">
            {decryptedContent}
          </p>
          <p className="text-sm text-white/70">{createdAt}</p>
        </div>
      </div>
    </NavLink>
  );
});
