import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { UserFeed } from '@app/user/components/feed';
import { UserMetadata } from '@app/user/components/metadata';

import { removeBlock } from '@libs/storage';

import { ZapIcon } from '@shared/icons';
import { Image } from '@shared/image';
import { TitleBar } from '@shared/titleBar';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { useSocial } from '@utils/hooks/useSocial';
import { shortenKey } from '@utils/shortenKey';
import { Block } from '@utils/types';

export function UserBlock({ params }: { params: Block }) {
  const queryClient = useQueryClient();

  const { user } = useProfile(params.content);
  const { status, userFollows, follow, unfollow } = useSocial();

  const [followed, setFollowed] = useState(false);

  const block = useMutation({
    mutationFn: (id: string) => {
      return removeBlock(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
    },
  });

  const followUser = (pubkey: string) => {
    try {
      follow(pubkey);

      // update state
      setFollowed(true);
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = (pubkey: string) => {
    try {
      unfollow(pubkey);

      // update state
      setFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === 'success' && userFollows) {
      if (userFollows.includes(params.content)) {
        setFollowed(true);
      }
    }
  }, [status]);

  return (
    <div className="w-[400px] shrink-0 border-r border-zinc-900">
      <TitleBar title={params.title} onClick={() => block.mutate(params.id)} />
      <div className="scrollbar-hide flex h-full w-full flex-col gap-1.5 overflow-y-auto pb-20 pt-1.5">
        <div className="px-3 pt-1.5">
          <Image
            src={user?.picture || user?.image}
            fallback={DEFAULT_AVATAR}
            alt={params.content}
            className="h-14 w-14 rounded-md ring-2 ring-black"
          />
          <div className="mt-2 flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2">
              <h5 className="text-lg font-semibold leading-none">
                {user?.displayName || user?.name || 'No name'}
              </h5>
              <span className="max-w-[15rem] truncate text-sm leading-none text-zinc-500">
                {user?.nip05 || shortenKey(params.content)}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <p className="mt-2 max-w-[500px] select-text break-words text-zinc-100">
                {user?.about}
              </p>
              <UserMetadata pubkey={params.content} />
            </div>
            <div className="mt-4 inline-flex items-center gap-2">
              {status === 'loading' ? (
                <button
                  type="button"
                  className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-zinc-900 text-sm font-medium hover:bg-fuchsia-500"
                >
                  Loading...
                </button>
              ) : followed ? (
                <button
                  type="button"
                  onClick={() => unfollowUser(params.content)}
                  className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-zinc-900 text-sm font-medium hover:bg-fuchsia-500"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => followUser(params.content)}
                  className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-zinc-900 text-sm font-medium hover:bg-fuchsia-500"
                >
                  Follow
                </button>
              )}
              <Link
                to={`/app/chat/${params.content}`}
                className="inline-flex h-10 w-36 items-center justify-center rounded-md bg-zinc-900 text-sm font-medium hover:bg-fuchsia-500"
              >
                Message
              </Link>
              <button
                type="button"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-md bg-zinc-900 text-sm font-medium hover:bg-orange-500"
              >
                <ZapIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="mt-2 px-3 text-lg font-semibold text-zinc-300">Timeline</h3>
          <UserFeed pubkey={params.content} />
        </div>
      </div>
    </div>
  );
}
