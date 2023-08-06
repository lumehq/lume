import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function ChatsListSelfItem({ data }: { data: { pubkey: string } }) {
  const { status, user } = useProfile(data.pubkey);

  if (status === 'loading') {
    return (
      <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2">
        <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-white/10" />
        <div>
          <div className="h-2.5 w-full animate-pulse truncate rounded bg-white/10 text-base font-medium" />
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={`/chats/${data.pubkey}`}
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
        alt={data.pubkey}
        className="h-6 w-6 shrink-0 rounded bg-white object-cover"
      />
      <div className="inline-flex items-baseline gap-1">
        <h5 className="max-w-[10rem] truncate">
          {user?.nip05 || user?.name || displayNpub(data.pubkey, 16)}
        </h5>
        <span className="text-white/50">(you)</span>
      </div>
    </NavLink>
  );
}
