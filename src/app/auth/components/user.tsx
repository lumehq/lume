import { Link } from 'react-router-dom';

import { WorldIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { useProfile } from '@utils/hooks/useProfile';

export function User({ pubkey, fallback }: { pubkey: string; fallback?: string }) {
  const { status, user } = useProfile(pubkey, fallback);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="relative h-14 w-14 shrink-0 animate-pulse rounded-md bg-white/10 backdrop-blur-xl" />
        <div className="flex w-full flex-1 flex-col items-start gap-1 text-start">
          <span className="h-4 w-1/2 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
          <span className="h-3 w-1/3 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-2.5">
      <Image
        src={user?.picture || user?.image}
        alt={pubkey}
        className="h-14 w-14 shrink-0 rounded-lg object-cover"
      />
      <div className="flex h-full flex-col items-start justify-between">
        <div className="flex flex-col items-start gap-1 text-start">
          <p className="max-w-[15rem] truncate text-lg font-semibold leading-none text-white">
            {user?.name || user?.display_name}
          </p>
          <p className="line-clamp-6 break-all text-white/70">
            {user?.about || user?.bio || 'No bio'}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {user?.website ? (
            <Link
              to={user?.website}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-white/70"
            >
              <WorldIcon className="h-4 w-4" />
              <p className="max-w-[10rem] truncate">{user.website}</p>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
