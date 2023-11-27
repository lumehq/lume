import { NDKUser } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { FollowIcon } from '@shared/icons';

import { shortenKey } from '@utils/shortenKey';

export interface Profile {
  pubkey: string;
  profile: { content: string };
}

export function NostrBandUserProfile({ data }: { data: Profile }) {
  const { db } = useStorage();
  const { ndk } = useNDK();

  const [followed, setFollowed] = useState(false);
  const navigate = useNavigate();

  const profile = data.profile ? JSON.parse(data.profile.content) : null;

  const follow = async (pubkey: string) => {
    try {
      if (!ndk.signer) return navigate('/new/privkey');
      setFollowed(true);

      const user = ndk.getUser({ pubkey: db.account.pubkey });
      const contacts = await user.follows();
      const add = await user.follow(new NDKUser({ pubkey: pubkey }), contacts);

      if (!add) {
        toast.success('You already follow this user');
        setFollowed(false);
      }
    } catch (e) {
      toast.error(e);
      setFollowed(false);
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
            {!followed ? (
              <button
                type="button"
                onClick={() => follow(data.pubkey)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-200 text-neutral-900 backdrop-blur-xl hover:bg-blue-600 hover:text-white dark:bg-neutral-800 dark:text-neutral-100 dark:hover:text-white"
              >
                <FollowIcon className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
        <div className="mt-2 line-clamp-5 whitespace-pre-line break-all text-neutral-900 dark:text-neutral-100">
          {profile.about || profile.bio}
        </div>
      </div>
    </div>
  );
}
