import { NDKEvent, NDKKind, NDKUser } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { NIP05 } from '@shared/nip05';

import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function UserProfile({ pubkey }: { pubkey: string }) {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { user } = useProfile(pubkey);

  const [followed, setFollowed] = useState(false);

  const follow = async (pubkey: string) => {
    try {
      const user = ndk.getUser({ pubkey: db.account.pubkey });
      const contacts = await user.follows();
      const add = await user.follow(new NDKUser({ pubkey: pubkey }), contacts);

      if (add) {
        setFollowed(true);
      } else {
        toast('You already follow this user');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unfollow = async (pubkey: string) => {
    try {
      const user = ndk.getUser({ pubkey: db.account.pubkey });
      const contacts = await user.follows();
      contacts.delete(new NDKUser({ pubkey: pubkey }));

      let list: string[][];
      contacts.forEach((el) => list.push(['p', el.pubkey, el.relayUrls?.[0] || '', '']));

      const event = new NDKEvent(ndk);
      event.content = '';
      event.kind = NDKKind.Contacts;
      event.tags = list;

      const publishedRelays = await event.publish();
      if (publishedRelays) {
        setFollowed(false);
      }
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
          className="h-12 w-12 shrink-0 rounded-lg object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="inline-flex items-center gap-2">
          {followed ? (
            <button
              type="button"
              onClick={() => unfollow(pubkey)}
              className="inline-flex h-9 w-28 items-center justify-center rounded-lg bg-neutral-200 text-sm font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
            >
              Unfollow
            </button>
          ) : (
            <button
              type="button"
              onClick={() => follow(pubkey)}
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
      <div className="mt-2 flex flex-1 flex-col gap-1.5">
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
        <div className="max-w-[500px] select-text break-words text-neutral-900 dark:text-neutral-100">
          {user?.about}
        </div>
      </div>
    </div>
  );
}
