import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { VerticalDotsIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

import { formatCreatedAt } from '@utils/createdAt';
import { useProfile } from '@utils/hooks/useProfile';
import { shortenKey } from '@utils/shortenKey';

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
    <Popover
      className={`flex ${size === 'small' ? 'items-center gap-2' : 'items-start gap-3'}`}
    >
      <Popover.Button
        className={`${avatarWidth} ${avatarHeight} relative z-10 shrink-0 overflow-hidden bg-zinc-900`}
      >
        <Image
          src={user?.picture || user?.image}
          fallback={DEFAULT_AVATAR}
          alt={pubkey}
          className={`${
            isRepost ? 'ring-1 ring-zinc-800' : ''
          } ${avatarWidth} ${avatarHeight} ${
            size === 'small' ? 'rounded' : 'rounded-lg'
          } object-cover`}
        />
      </Popover.Button>
      <div
        className={`${isRepost ? 'mt-4' : ''} flex flex-1 items-baseline justify-between`}
      >
        <h5
          className={`truncate font-semibold leading-none text-zinc-100 ${
            size === 'small' ? 'max-w-[10rem]' : 'max-w-[15rem]'
          }`}
        >
          {user?.nip05?.toLowerCase() ||
            user?.name ||
            user?.display_name ||
            shortenKey(pubkey)}
        </h5>
        <div className="inline-flex items-center gap-2">
          <span className="leading-none text-zinc-500">{createdAt}</span>
          <button
            type="button"
            className="inline-flex h-5 w-max items-center justify-center rounded px-1 hover:bg-zinc-800"
          >
            <VerticalDotsIcon className="h-4 w-4 rotate-90 transform text-zinc-200" />
          </button>
        </div>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute top-10 z-50 mt-3">
          <div className="w-[250px] overflow-hidden rounded-md border border-zinc-800/50 bg-zinc-900/90 backdrop-blur-lg">
            <div className="flex gap-2.5 border-b border-zinc-800 px-3 py-3">
              <Image
                src={user?.picture || user?.image}
                fallback={DEFAULT_AVATAR}
                alt={pubkey}
                className="h-11 w-11 shrink-0 rounded-lg object-cover"
              />
              <div className="flex flex-1 flex-col gap-2">
                <div className="inline-flex flex-col gap-1">
                  <h5 className="text-sm font-semibold leading-none">
                    {user?.displayName || user?.name || (
                      <div className="h-3 w-20 animate-pulse rounded-sm bg-zinc-700" />
                    )}
                  </h5>
                  <span className="max-w-[10rem] truncate text-sm leading-none text-zinc-500">
                    {user?.nip05 || shortenKey(pubkey)}
                  </span>
                </div>
                <div>
                  <p className="line-clamp-3 break-all leading-tight text-zinc-100">
                    {user?.about}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-3">
              <Link
                to={`/app/users/${pubkey}`}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-zinc-700 text-sm font-medium hover:bg-fuchsia-500"
              >
                View profile
              </Link>
              <Link
                to={`/app/chats/${pubkey}`}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-zinc-700 text-sm font-medium hover:bg-fuchsia-500"
              >
                Message
              </Link>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
