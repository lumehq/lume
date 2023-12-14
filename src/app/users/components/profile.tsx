import * as Avatar from '@radix-ui/react-avatar';
import { minidenticon } from 'minidenticons';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserStats } from '@app/users/components/stats';
import { useArk } from '@libs/ark';
import { NIP05 } from '@shared/nip05';
import { displayNpub } from '@utils/formater';
import { useProfile } from '@utils/hooks/useProfile';

export function UserProfile({ pubkey }: { pubkey: string }) {
  const ark = useArk();
  const { user } = useProfile(pubkey);

  const [followed, setFollowed] = useState(false);

  const navigate = useNavigate();
  const svgURI =
    'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(pubkey, 90, 50));

  const follow = async () => {
    try {
      if (!ark.readyToSign) return navigate('/new/privkey');
      setFollowed(true);

      const add = await ark.createContact({ pubkey });

      if (!add) {
        toast.success('You already follow this user');
        setFollowed(false);
      }
    } catch (e) {
      toast.error(e);
      setFollowed(false);
    }
  };

  const unfollow = async () => {
    try {
      if (!ark.readyToSign) return navigate('/new/privkey');
      setFollowed(false);

      await ark.deleteContact({ pubkey });
    } catch (e) {
      toast.error(e);
    }
  };

  useEffect(() => {
    if (ark.account.contacts.includes(pubkey)) {
      setFollowed(true);
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <div className="h-56 w-full overflow-hidden rounded-tl-lg">
        {user?.banner ? (
          <img
            src={user?.banner}
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
            className="h-14 w-14 rounded-lg bg-white object-cover ring-2 ring-neutral-100 dark:ring-neutral-900"
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
                {user?.name || user?.display_name || user?.displayName || 'No name'}
              </h5>
              {user?.nip05 ? (
                <NIP05
                  pubkey={pubkey}
                  nip05={user.nip05}
                  className="text-neutral-600 dark:text-neutral-400"
                />
              ) : (
                <span className="max-w-[15rem] truncate text-sm text-neutral-500 dark:text-neutral-400">
                  {displayNpub(pubkey, 16)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-6">
              {user?.about || user?.bio ? (
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
                onClick={unfollow}
                className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-neutral-200 text-sm font-medium text-neutral-900 backdrop-blur-xl hover:bg-blue-500 hover:text-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-blue-600 dark:hover:text-neutral-100"
              >
                Unfollow
              </button>
            ) : (
              <button
                type="button"
                onClick={follow}
                className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-neutral-200 text-sm font-medium text-neutral-900 backdrop-blur-xl hover:bg-blue-500 hover:text-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-blue-600 dark:hover:text-neutral-100"
              >
                Follow
              </button>
            )}
            <Link
              to={`/chats/${pubkey}`}
              className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-neutral-200 text-sm font-medium text-neutral-900 backdrop-blur-xl hover:bg-blue-500 hover:text-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-blue-600 dark:hover:text-neutral-100"
            >
              Message
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
