import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { UserStats } from '@app/users/components/stats';

import { useStorage } from '@libs/storage/provider';

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

  return (
    <div>
      <div className="flex items-center justify-between">
        <img
          src={user?.picture || user?.image}
          alt={pubkey}
          className="h-12 w-12 shrink-0 rounded-lg"
          loading="lazy"
          decoding="async"
          style={{ contentVisibility: 'auto' }}
        />
        <div className="inline-flex items-center gap-2">
          {followed ? (
            <button
              type="button"
              onClick={() => unfollowUser(pubkey)}
              className="inline-flex h-9 w-28 items-center justify-center rounded-lg bg-neutral-200 text-sm font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
            >
              Unfollow
            </button>
          ) : (
            <button
              type="button"
              onClick={() => followUser(pubkey)}
              className="inline-flex h-9 w-28 items-center justify-center rounded-lg bg-neutral-200 text-sm font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
            >
              Follow
            </button>
          )}
          <Link
            to={`/chats/${pubkey}`}
            className="inline-flex h-9 w-28 items-center justify-center rounded-lg bg-neutral-200 text-sm font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
          >
            Message
          </Link>
        </div>
      </div>
      <div className="mt-2 flex flex-1 flex-col">
        <div className="flex flex-col">
          <h5 className="text-lg font-semibold">
            {user?.name || user?.display_name || user?.displayName || 'Anon'}
          </h5>
          {user?.nip05 ? (
            <NIP05
              pubkey={pubkey}
              nip05={user?.nip05}
              className="max-w-[15rem] truncate text-sm text-neutral-600 dark:text-neutral-400"
            />
          ) : (
            <span className="max-w-[15rem] truncate text-sm text-neutral-600 dark:text-neutral-400">
              {displayNpub(pubkey, 16)}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <p className="mb-3 mt-2 max-w-[500px] select-text break-words text-neutral-900 dark:text-neutral-100">
            {user?.about}
          </p>
          <UserStats pubkey={pubkey} />
        </div>
      </div>
    </div>
  );
}
