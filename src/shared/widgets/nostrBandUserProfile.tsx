import { NDKEvent, NDKKind, NDKUser } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { FollowIcon, UnfollowIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { compactNumber } from '@utils/number';
import { shortenKey } from '@utils/shortenKey';

export interface Profile {
  pubkey: string;
  profile: { content: string };
}

export function NostrBandUserProfile({ data }: { data: Profile }) {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, data: userStats } = useQuery({
    queryKey: ['user-stats', data.pubkey],
    queryFn: async () => {
      const res = await fetch(`https://api.nostr.band/v0/stats/profile/${data.pubkey}`);
      return res.json();
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const embedProfile = data.profile ? JSON.parse(data.profile.content) : null;
  const profile = embedProfile;

  const [followed, setFollowed] = useState(false);

  const follow = async (pubkey: string) => {
    try {
      const user = ndk.getUser({ hexpubkey: db.account.pubkey });
      const contacts = await user.follows();
      const add = await user.follow(new NDKUser({ hexpubkey: pubkey }), contacts);

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
      const user = ndk.getUser({ hexpubkey: db.account.pubkey });
      const contacts = await user.follows();
      contacts.delete(new NDKUser({ hexpubkey: pubkey }));

      let list: string[][];
      contacts.forEach((el) =>
        list.push(['p', el.pubkey, el.relayUrls?.[0] || '', el.profile?.name || ''])
      );

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
    <div className="h-min w-full px-3 pb-3">
      <div className="rounded-xl bg-neutral-100 px-5 py-5 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <Image
              src={profile.picture}
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
        <div className="mt-2">
          <p className="whitespace-pre-line break-words text-neutral-900 dark:text-neutral-100">
            {profile.about || profile.bio}
          </p>
        </div>
        <div className="mt-8">
          {status === 'pending' ? (
            <p>Loading...</p>
          ) : (
            <div className="flex w-full items-center gap-8">
              <div className="inline-flex flex-col gap-1">
                <span className="font-semibold leading-none text-neutral-900 dark:text-neutral-100">
                  {userStats.stats[data.pubkey].followers_pubkey_count ?? 0}
                </span>
                <span className="text-sm leading-none text-neutral-900 dark:text-neutral-100/50">
                  Followers
                </span>
              </div>
              <div className="inline-flex flex-col gap-1">
                <span className="font-semibold leading-none text-neutral-900 dark:text-neutral-100">
                  {userStats.stats[data.pubkey].pub_following_pubkey_count ?? 0}
                </span>
                <span className="text-sm leading-none text-neutral-900 dark:text-neutral-100/50">
                  Following
                </span>
              </div>
              <div className="inline-flex flex-col gap-1">
                <span className="font-semibold leading-none text-neutral-900 dark:text-neutral-100">
                  {userStats.stats[data.pubkey].zaps_received
                    ? compactNumber.format(
                        userStats.stats[data.pubkey].zaps_received.msats / 1000
                      )
                    : 0}
                </span>
                <span className="text-sm leading-none text-neutral-900 dark:text-neutral-100/50">
                  Zaps received
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
