import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { UserMetadata } from '@app/user/components/metadata';

import { ZapIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { useSocial } from '@utils/hooks/useSocial';
import { displayNpub } from '@utils/shortenKey';

export function UserProfile({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);
  const { status, userFollows, follow, unfollow } = useSocial();

  const [followed, setFollowed] = useState(false);

  const followUser = (pubkey: string) => {
    try {
      follow(pubkey);

      // update state
      setFollowed(true);
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = (pubkey: string) => {
    try {
      unfollow(pubkey);

      // update state
      setFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === 'success' && userFollows) {
      if (userFollows.includes(pubkey)) {
        setFollowed(true);
      }
    }
  }, [status]);

  return (
    <div>
      <Image
        src={user?.picture || user?.image}
        fallback={DEFAULT_AVATAR}
        alt={pubkey}
        className="h-14 w-14 rounded-md ring-2 ring-black"
      />
      <div className="mt-2 flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h5 className="text-lg font-semibold leading-none">
            {user?.displayName || user?.name || 'No name'}
          </h5>
          <span className="max-w-[15rem] truncate text-sm leading-none text-zinc-500">
            {user?.nip05 || displayNpub(pubkey, 16)}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <p className="mt-2 max-w-[500px] select-text break-words text-zinc-100">
            {user?.about}
          </p>
          <UserMetadata pubkey={pubkey} />
        </div>
        <div className="mt-4 inline-flex items-center gap-2">
          {status === 'loading' ? (
            <button
              type="button"
              className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-zinc-900 text-sm font-medium hover:bg-fuchsia-500"
            >
              Loading...
            </button>
          ) : followed ? (
            <button
              type="button"
              onClick={() => unfollowUser(pubkey)}
              className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-zinc-900 text-sm font-medium hover:bg-fuchsia-500"
            >
              Unfollow
            </button>
          ) : (
            <button
              type="button"
              onClick={() => followUser(pubkey)}
              className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-zinc-900 text-sm font-medium hover:bg-fuchsia-500"
            >
              Follow
            </button>
          )}
          <Link
            to={`/app/chat/${pubkey}`}
            className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-zinc-900 text-sm font-medium hover:bg-fuchsia-500"
          >
            Message
          </Link>
          <button
            type="button"
            className="group inline-flex h-10 w-10 items-center justify-center rounded-md bg-zinc-900 text-sm font-medium hover:bg-orange-500"
          >
            <ZapIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
