import * as Popover from '@radix-ui/react-popover';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { VerticalDotsIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { formatCreatedAt } from '@utils/createdAt';
import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub, shortenKey } from '@utils/shortenKey';

export function User({
  pubkey,
  time,
  size,
  isRepost = false,
  isChat = false,
}: {
  pubkey: string;
  time: number;
  size?: string;
  isRepost?: boolean;
  isChat?: boolean;
}) {
  const { status, user } = useProfile(pubkey);
  const createdAt = formatCreatedAt(time, isChat);

  const avatarWidth = size === 'small' ? 'w-6' : 'w-11';
  const avatarHeight = size === 'small' ? 'h-6' : 'h-11';

  if (status === 'loading') {
    return (
      <div
        className={`relative flex gap-3 ${
          size === 'small' ? 'items-center' : 'items-start'
        }`}
      >
        <div
          className={`${avatarWidth} ${avatarHeight}  ${
            size === 'small' ? 'rounded' : 'rounded-lg'
          } relative z-10 shrink-0 animate-pulse overflow-hidden bg-zinc-800`}
        />
        <div className="flex flex-wrap items-baseline gap-1">
          <div className="h-3.5 w-36 animate-pulse rounded bg-zinc-800" />
        </div>
      </div>
    );
  }

  return (
    <Popover.Root>
      <div
        className={twMerge(
          'relative flex',
          size === 'small' ? 'items-center gap-2' : 'items-start gap-3'
        )}
      >
        <Popover.Trigger asChild>
          <button
            type="button"
            className={`${avatarWidth} ${avatarHeight} relative z-40 shrink-0 overflow-hidden`}
          >
            <Image
              src={user?.picture || user?.image}
              fallback={DEFAULT_AVATAR}
              alt={pubkey}
              className={twMerge(
                `object-cover ${avatarWidth} ${avatarHeight}`,
                size === 'small' ? 'rounded' : 'rounded-lg',
                isRepost ? 'ring-1 ring-zinc-800' : ''
              )}
            />
          </button>
        </Popover.Trigger>
        <div
          className={twMerge('flex flex-1 items-baseline gap-2', isRepost ? 'mt-4' : '')}
        >
          <h5
            className={twMerge(
              'truncate font-semibold leading-none text-white',
              size === 'small' ? 'max-w-[10rem]' : 'max-w-[15rem]'
            )}
          >
            {user?.nip05?.toLowerCase() ||
              user?.name ||
              user?.display_name ||
              shortenKey(pubkey)}
          </h5>
          <span className="leading-none text-white/50">·</span>
          <span className="leading-none text-white/50">{createdAt}</span>
        </div>
      </div>
      <Popover.Portal>
        <Popover.Content
          className="w-[300px] overflow-hidden rounded-md bg-white/10 backdrop-blur-xl"
          sideOffset={5}
        >
          <div className="flex gap-2.5 border-b border-white/5 px-3 py-3">
            <Image
              src={user?.picture || user?.image}
              fallback={DEFAULT_AVATAR}
              alt={pubkey}
              className="h-11 w-11 shrink-0 rounded-lg object-cover"
            />
            <div className="flex flex-1 flex-col gap-2">
              <div className="inline-flex flex-col gap-1">
                <h5 className="text-sm font-semibold leading-none">
                  {user?.displayName || user?.name}
                </h5>
                <span className="max-w-[10rem] truncate text-sm leading-none text-white/50">
                  {user?.nip05 || displayNpub(pubkey, 16)}
                </span>
              </div>
              <div>
                <p className="line-clamp-3 break-all leading-tight text-white">
                  {user?.about}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-3">
            <Link
              to={`/app/users/${pubkey}`}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-white/10 text-sm font-medium hover:bg-fuchsia-500"
            >
              View profile
            </Link>
            <Link
              to={`/app/chats/${pubkey}`}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-white/10 text-sm font-medium hover:bg-fuchsia-500"
            >
              Message
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
