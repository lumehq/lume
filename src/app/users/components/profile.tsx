import { NDKEvent, NDKKind, NDKUser } from '@nostr-dev-kit/ndk';
import * as Avatar from '@radix-ui/react-avatar';
import { minidenticon } from 'minidenticons';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { EditProfileModal } from '@app/users/components/modal';
import { UserStats } from '@app/users/components/stats';

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

  const svgURI =
    'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(pubkey, 90, 50));

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
        <Avatar.Root className="shrink-0">
          <Avatar.Image
            src={user?.picture || user?.image}
            alt={pubkey}
            loading="lazy"
            decoding="async"
            style={{ contentVisibility: 'auto' }}
            className="h-14 w-14 rounded-lg bg-white ring-2 ring-neutral-100 dark:ring-neutral-900"
          />
          <Avatar.Fallback delayMs={300}>
            <img
              src={svgURI}
              alt={pubkey}
              className="h-14 w-14 rounded-lg bg-black dark:bg-white"
            />
          </Avatar.Fallback>
        </Avatar.Root>
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
                  className="text-neutral-600 dark:text-neutral-400"
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
                onClick={() => unfollow(pubkey)}
                className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-neutral-200 text-sm font-medium text-neutral-900 backdrop-blur-xl hover:bg-blue-600 hover:text-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-blue-600 dark:hover:text-neutral-100"
              >
                Unfollow
              </button>
            ) : (
              <button
                type="button"
                onClick={() => follow(pubkey)}
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
