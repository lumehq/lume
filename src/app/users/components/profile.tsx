import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { EditProfileModal } from '@app/users/components/modal';
import { UserStats } from '@app/users/components/stats';

import { useStorage } from '@libs/storage/provider';

import { Image } from '@shared/image';
import { NIP05 } from '@shared/nip05';

import { useNostr } from '@utils/hooks/useNostr';
import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function UserProfile({ pubkey }: { pubkey: string }) {
  const { db } = useStorage();
  const { user } = useProfile(pubkey);
  const { addContact, removeContact } = useNostr();

  const [followed, setFollowed] = useState(false);

  const followUser = (pubkey: string) => {
    try {
      addContact(pubkey);
      // update state
      setFollowed(true);
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = (pubkey: string) => {
    try {
      removeContact(pubkey);
      // update state
      setFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (db.account.follows.includes(pubkey)) {
      setFollowed(true);
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <div className="h-56 w-full overflow-hidden rounded-tl-lg">
        {user.banner ? (
          <img
            src={user.banner}
            alt="user banner"
            className="h-full w-full rounded-tl-lg object-cover"
          />
        ) : (
          <div className="h-full w-full rounded-tl-lg bg-neutral-100 dark:bg-neutral-900" />
        )}
      </div>
      <div className="-mt-7 flex w-full flex-col items-center px-5">
        <Image
          src={user.picture || user.image}
          alt={pubkey}
          className="h-14 w-14 rounded-lg ring-2 ring-neutral-100 dark:ring-neutral-900"
        />
        <div className="mt-2 flex flex-1 flex-col gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="inline-flex flex-col items-center">
              <h5 className="text-center text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {user.name || user.display_name || user.displayName || 'No name'}
              </h5>
              {user.nip05 ? (
                <NIP05
                  pubkey={pubkey}
                  nip05={user?.nip05}
                  className="max-w-[15rem] truncate text-sm text-neutral-500 dark:text-neutral-400"
                />
              ) : (
                <span className="max-w-[15rem] truncate text-sm text-neutral-500 dark:text-neutral-400">
                  {displayNpub(pubkey, 16)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-6">
              {user.about || user.bio ? (
                <p className="mt-2 max-w-[500px] select-text break-words text-center text-neutral-900 dark:text-neutral-100">
                  {user.about || user.bio}
                </p>
              ) : (
                <div />
              )}
              <UserStats pubkey={pubkey} />
            </div>
          </div>
          <div className="inline-flex items-center justify-center gap-2">
            {followed ? (
              <button
                type="button"
                onClick={() => unfollowUser(pubkey)}
                className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-neutral-200 text-sm font-medium text-neutral-900 backdrop-blur-xl hover:bg-blue-600 hover:text-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-blue-600 dark:hover:text-neutral-100"
              >
                Unfollow
              </button>
            ) : (
              <button
                type="button"
                onClick={() => followUser(pubkey)}
                className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-neutral-200 text-sm font-medium text-neutral-900 backdrop-blur-xl hover:bg-blue-600 hover:text-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-blue-600 dark:hover:text-neutral-100"
              >
                Follow
              </button>
            )}
            <Link
              to={`/chats/${pubkey}`}
              className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-neutral-200 text-sm font-medium text-neutral-900 backdrop-blur-xl hover:bg-blue-600 hover:text-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-blue-600 dark:hover:text-neutral-100"
            >
              Message
            </Link>
            {db.account.pubkey === pubkey && (
              <>
                <span className="mx-2 inline-flex h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
                <EditProfileModal />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
