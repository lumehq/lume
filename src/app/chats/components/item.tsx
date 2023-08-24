import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { Image } from '@shared/image';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function ChatsListItem({ pubkey }: { pubkey: string }) {
  const { status, user } = useProfile(pubkey);

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
      to={`/chats/${pubkey}`}
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
        alt={pubkey}
        className="h-6 w-6 shrink-0 rounded object-cover"
      />
      <div className="inline-flex w-full flex-1 items-center justify-between">
        <h5 className="max-w-[10rem] truncate">
          {user?.nip05 || user?.name || user?.display_name || displayNpub(pubkey, 16)}
        </h5>
      </div>
    </NavLink>
  );
}
