import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';
import { Chats } from '@utils/types';

export function ChatsListItem({ data }: { data: Chats }) {
  const { status, user } = useProfile(data.sender_pubkey);

  if (status === 'loading') {
    return (
      <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2">
        <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-white/10" />
        <div className="h-2.5 w-2/3 animate-pulse rounded bg-white/10" />
      </div>
    );
  }

  return (
    <NavLink
      to={`/chats/${data.sender_pubkey}`}
      preventScrollReset={true}
      className={({ isActive }) =>
        twMerge(
          'inline-flex h-9 items-center gap-2.5 rounded-md px-2',
          isActive ? 'bg-white/10 text-white' : 'text-white/80'
        )
      }
    >
      <Image
        src={user?.picture || user?.image}
        fallback={DEFAULT_AVATAR}
        alt={data.sender_pubkey}
        className="h-6 w-6 shrink-0 rounded object-cover"
      />
      <div className="inline-flex w-full flex-1 items-center justify-between">
        <h5 className="max-w-[10rem] truncate">
          {user?.nip05 ||
            user?.name ||
            user?.display_name ||
            displayNpub(data.sender_pubkey, 16)}
        </h5>
        <div className="flex items-center">
          {data.new_messages > 0 && (
            <span className="inline-flex w-8 items-center justify-center rounded bg-fuchsia-400/10 px-1 py-1 text-xs font-medium text-fuchsia-500 ring-1 ring-inset ring-fuchsia-400/20">
              {data.new_messages}
            </span>
          )}
        </div>
      </div>
    </NavLink>
  );
}
