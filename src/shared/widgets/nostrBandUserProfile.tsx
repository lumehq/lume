import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useStorage } from '@libs/storage/provider';

import { FollowIcon, UnfollowIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { useNostr } from '@utils/hooks/useNostr';
import { compactNumber } from '@utils/number';
import { shortenKey } from '@utils/shortenKey';

export interface Profile {
  pubkey: string;
  profile: { content: string };
}

export function NostrBandUserProfile({ data }: { data: Profile }) {
  const { db } = useStorage();
  const { addContact, removeContact } = useNostr();
  const { status, data: userStats } = useQuery(
    ['user-stats', data.pubkey],
    async () => {
      const res = await fetch(`https://api.nostr.band/v0/stats/profile/${data.pubkey}`);
      return res.json();
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const embedProfile = data.profile ? JSON.parse(data.profile.content) : null;
  const profile = embedProfile;

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
    if (db.account.follows.includes(data.pubkey)) {
      setFollowed(true);
    }
  }, []);

  if (!profile) {
    return (
      <div className="rounded-xl bg-white/10 px-5 py-5 backdrop-blur-xl">
        <p>Can&apos;t fetch profile</p>
      </div>
    );
  }

  return (
    <div className="h-min w-full px-3 pb-3">
      <div className="rounded-xl bg-white/10 px-5 py-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <Image
              src={profile.picture}
              className="h-11 w-11 shrink-0 rounded-lg object-cover"
            />
            <div className="inline-flex flex-col gap-1">
              <h3 className="max-w-[15rem] truncate font-semibold leading-none text-white">
                {profile.display_name || profile.name}
              </h3>
              <p className="max-w-[10rem] truncate text-sm leading-none text-white/50">
                {profile.nip05 || shortenKey(data.pubkey)}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2">
            {followed ? (
              <button
                type="button"
                onClick={() => unfollowUser(data.pubkey)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white backdrop-blur-xl hover:bg-interor-500 hover:text-white"
              >
                <UnfollowIcon className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => followUser(data.pubkey)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white backdrop-blur-xl hover:bg-interor-500 hover:text-white"
              >
                <FollowIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-2">
          <p className="whitespace-pre-line break-words text-white">
            {profile.about || profile.bio}
          </p>
        </div>
        <div className="mt-8">
          {status === 'loading' ? (
            <p>Loading...</p>
          ) : (
            <div className="flex w-full items-center gap-8">
              <div className="inline-flex flex-col gap-1">
                <span className="font-semibold leading-none text-white">
                  {userStats.stats[data.pubkey].followers_pubkey_count ?? 0}
                </span>
                <span className="text-sm leading-none text-white/50">Followers</span>
              </div>
              <div className="inline-flex flex-col gap-1">
                <span className="font-semibold leading-none text-white">
                  {userStats.stats[data.pubkey].pub_following_pubkey_count ?? 0}
                </span>
                <span className="text-sm leading-none text-white/50">Following</span>
              </div>
              <div className="inline-flex flex-col gap-1">
                <span className="font-semibold leading-none text-white">
                  {userStats.stats[data.pubkey].zaps_received
                    ? compactNumber.format(
                        userStats.stats[data.pubkey].zaps_received.msats / 1000
                      )
                    : 0}
                </span>
                <span className="text-sm leading-none text-white/50">Zaps received</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
