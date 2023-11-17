import { NDKEvent, NDKKind, NDKUser } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { FollowIcon, UnfollowIcon } from '@shared/icons';

import { shortenKey } from '@utils/shortenKey';

export interface Profile {
  pubkey: string;
  profile: { content: string };
}

export function NostrBandUserProfile({ data }: { data: Profile }) {
  const embedProfile = data.profile ? JSON.parse(data.profile.content) : null;
  const profile = embedProfile;

  const { db } = useStorage();
  const { ndk } = useNDK();

  const [followed, setFollowed] = useState(false);
  const navigate = useNavigate();

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
      if (!ndk.signer) return navigate('/new/privkey');

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
    if (db.account.follows.includes(data.pubkey)) {
      setFollowed(true);
    }
  }, []);

  if (!profile) {
    return (
      <div className="rounded-xl bg-neutral-100 px-5 py-5 dark:bg-neutral-900">
        <p>Can&apos;t fetch profile</p>
      </div>
    );
  }

  return (
    <div className="mb-3 h-min w-full px-3">
      <div className="rounded-xl bg-neutral-50 px-5 py-5 dark:bg-neutral-950">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <img
              src={profile.picture}
              alt={data.pubkey}
              className="h-11 w-11 shrink-0 rounded-lg object-cover"
            />
            <div className="inline-flex flex-col">
              <h3 className="max-w-[15rem] truncate font-semibold text-neutral-900 dark:text-neutral-100">
                {profile.display_name || profile.name}
              </h3>
              <p className="max-w-[10rem] truncate text-sm text-neutral-900 dark:text-neutral-100/50">
                {profile.nip05 || shortenKey(data.pubkey)}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2">
            {followed ? (
              <button
                type="button"
                onClick={() => unfollow(data.pubkey)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-200 text-neutral-900 backdrop-blur-xl hover:bg-blue-600 hover:text-white dark:bg-neutral-800 dark:text-neutral-100 dark:hover:text-white"
              >
                <UnfollowIcon className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => follow(data.pubkey)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-200 text-neutral-900 backdrop-blur-xl hover:bg-blue-600 hover:text-white dark:bg-neutral-800 dark:text-neutral-100 dark:hover:text-white"
              >
                <FollowIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-2 line-clamp-5 whitespace-pre-line break-all text-neutral-900 dark:text-neutral-100">
          {profile.about || profile.bio}
        </div>
      </div>
    </div>
  );
}
