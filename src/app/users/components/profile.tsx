import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { UserMetadata } from '@app/users/components/metadata';

import { EditProfileModal } from '@shared/editProfileModal';
import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useAccount } from '@utils/hooks/useAccount';
import { useProfile } from '@utils/hooks/useProfile';
import { useSocial } from '@utils/hooks/useSocial';
import { shortenKey } from '@utils/shortenKey';

export function UserProfile({ pubkey }: { pubkey: string }) {
  const { user } = useProfile(pubkey);
  const { account } = useAccount();
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
    <>
      <div className="h-56 w-full bg-zinc-100">
        <Image
          src={user?.banner}
          fallback="https://void.cat/d/QY1myro5tkHVs2nY7dy74b.jpg"
          alt={'banner'}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="-mt-7 w-full px-5">
        <Image
          src={user?.picture || user?.image}
          fallback={DEFAULT_AVATAR}
          alt={pubkey}
          className="h-14 w-14 rounded-md ring-2 ring-black"
        />
        <div className="mt-2 flex flex-1 flex-col gap-4">
          <div className="flex items-center gap-16">
            <div className="inline-flex flex-col gap-1.5">
              <h5 className="text-lg font-semibold leading-none">
                {user?.displayName || user?.name || 'No name'}
              </h5>
              <span className="max-w-[15rem] truncate text-sm leading-none text-white/50">
                {user?.nip05 || shortenKey(pubkey)}
              </span>
            </div>
            <div className="inline-flex items-center gap-2">
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
                to={`/chats/${pubkey}`}
                className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-zinc-900 text-sm font-medium hover:bg-fuchsia-500"
              >
                Message
              </Link>
              <span className="mx-2 inline-flex h-4 w-px bg-zinc-900" />
              {account && account.pubkey === pubkey && <EditProfileModal />}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <p className="mt-2 max-w-[500px] select-text break-words text-white">
              {user?.about || user?.bio}
            </p>
            <UserMetadata pubkey={pubkey} />
          </div>
        </div>
      </div>
    </>
  );
}
