import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

export function ChatsListSelfItem({ data }: { data: any }) {
  const { status, user } = useProfile(data.pubkey);

  if (status === 'loading') {
    return (
      <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
        <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-zinc-800" />
        <div>
          <div className="h-2.5 w-full animate-pulse truncate rounded bg-zinc-800 text-base font-medium" />
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={`/app/chat/${data.pubkey}`}
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
          src={user?.image}
          fallback={DEFAULT_AVATAR}
          alt={data.pubkey}
          className="h-6 w-6 rounded bg-white object-cover"
        />
      </div>
      <div className="inline-flex items-baseline gap-1">
        <h5 className="max-w-[9rem] truncate font-medium text-zinc-200">
          {user?.nip05 || user?.name || shortenKey(data.pubkey)}
        </h5>
        <span className="text-zinc-500">(you)</span>
      </div>
    </NavLink>
  );
}
