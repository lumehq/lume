import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

export function ChatsListItem({ data }: { data: any }) {
  const { status, user } = useProfile(data.sender_pubkey);

  if (status === 'loading') {
    return (
      <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
        <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-zinc-800" />
        <div className="h-2.5 w-2/3 animate-pulse rounded bg-zinc-800" />
      </div>
    );
  }

  return (
    <NavLink
      to={`/app/chats/${data.sender_pubkey}`}
      preventScrollReset={true}
      className={({ isActive }) =>
        twMerge(
          'inline-flex h-9 items-center gap-2.5 rounded-md px-2.5',
          isActive ? 'bg-zinc-900/50 text-zinc-100' : ''
        )
      }
    >
      <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-800/50 bg-zinc-900">
        <Image
          src={user?.picture || user?.image}
          fallback={DEFAULT_AVATAR}
          alt={data.sender_pubkey}
          className="h-6 w-6 rounded object-cover"
        />
      </div>
      <div className="inline-flex w-full items-center justify-between">
        <div className="inline-flex items-baseline gap-1">
          <h5 className="max-w-[10rem] truncate font-medium text-zinc-200">
            {user?.nip05 ||
              user?.name ||
              user?.displayName ||
              shortenKey(data.sender_pubkey)}
          </h5>
        </div>
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
