import { Link } from 'react-router-dom';

import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function ChatSidebar({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);

  return (
    <div className="px-3 py-2">
      <div className="flex flex-col gap-3">
        <div className="relative h-11 w-11 shrink rounded-md">
          <Image
            src={user?.picture || user?.image}
            fallback={DEFAULT_AVATAR}
            alt={pubkey}
            className="h-11 w-11 rounded-md object-cover"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold leading-none">
              {user?.display_name || user?.name}
            </h3>
            <h5 className="leading-none text-white/50">
              {user?.nip05 || displayNpub(pubkey, 16)}
            </h5>
          </div>
          <div>
            <p className="leading-tight">{user?.bio || user?.about}</p>
            <Link
              to={`/users/${pubkey}`}
              className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-md bg-white/10 text-sm font-medium text-white hover:bg-fuchsia-500"
            >
              View full profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
