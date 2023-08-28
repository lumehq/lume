import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { UserStats } from '@app/users/components/stats';

import { useStorage } from '@libs/storage/provider';

import { Image } from '@shared/image';

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
      <Image
        src={user?.picture || user?.image}
        alt={pubkey}
        className="h-14 w-14 rounded-md"
      />
      <div className="mt-2 flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h5 className="text-lg font-semibold leading-none">
            {user?.displayName || user?.name || 'No name'}
          </h5>
          <span className="max-w-[15rem] truncate text-sm leading-none text-white/50">
            {user?.nip05 || displayNpub(pubkey, 16)}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <p className="mt-2 max-w-[500px] select-text break-words text-white">
            {user?.about}
          </p>
          <UserStats pubkey={pubkey} />
        </div>
        <div className="mt-4 inline-flex items-center gap-2">
          {followed ? (
            <button
              type="button"
              onClick={() => unfollowUser(pubkey)}
              className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-white/10 text-sm font-medium backdrop-blur-xl hover:bg-fuchsia-500"
            >
              Unfollow
            </button>
          ) : (
            <button
              type="button"
              onClick={() => followUser(pubkey)}
              className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-white/10 text-sm font-medium backdrop-blur-xl hover:bg-fuchsia-500"
            >
              Follow
            </button>
          )}
          <Link
            to={`/chats/${pubkey}`}
            className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-white/10 text-sm font-medium backdrop-blur-xl hover:bg-fuchsia-500"
          >
            Message
          </Link>
        </div>
      </div>
    </div>
  );
}
