import * as Popover from '@radix-ui/react-popover';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

import { WorldIcon } from '@shared/icons';
import { Image } from '@shared/image';
import { NIP05 } from '@shared/nip05';

import { formatCreatedAt } from '@utils/createdAt';
import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export const User = memo(function User({
  pubkey,
  time,
  variant = 'default',
  embedProfile,
}: {
  pubkey: string;
  time?: number;
  variant?:
    | 'default'
    | 'simple'
    | 'mention'
    | 'repost'
    | 'chat'
    | 'large'
    | 'thread'
    | 'avatar';
  embedProfile?: string;
}) {
  const { status, user } = useProfile(pubkey, embedProfile);
  const createdAt = time ? formatCreatedAt(time, variant === 'chat') : 0;

  if (status === 'loading') {
    if (variant === 'mention') {
      return (
        <div className="relative flex items-center gap-3">
          <div className="relative z-10 h-6 w-6 shrink-0 animate-pulse overflow-hidden rounded bg-white/10 backdrop-blur-xl" />
          <div className="h-3.5 w-36 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
        </div>
      );
    }

    return (
      <div className="relative flex items-start gap-3">
        <div className="relative z-10 h-11 w-11 shrink-0 animate-pulse overflow-hidden rounded-lg bg-white/10 backdrop-blur-xl" />
        <div className="h-3.5 w-36 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
      </div>
    );
  }

  if (variant === 'mention') {
    return (
      <div className="relative z-10 flex items-center gap-2">
        <button type="button" className="relative z-40 h-6 w-6 shrink-0 overflow-hidden">
          <Image
            src={user?.picture || user?.image}
            alt={pubkey}
            className="h-6 w-6 rounded object-cover"
          />
        </button>
        <div className="flex flex-1 items-baseline gap-2">
          <h5 className="max-w-[10rem] truncate font-semibold leading-none text-white">
            {user?.display_name || user?.name || displayNpub(pubkey, 16)}
          </h5>
          <span className="leading-none text-white/50">·</span>
          <span className="leading-none text-white/50">{createdAt}</span>
        </div>
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className="flex h-full w-full flex-col gap-2.5">
        <Image
          src={user?.picture || user?.image}
          alt={pubkey}
          className="h-14 w-14 shrink-0 rounded-lg object-cover"
        />
        <div className="flex h-full flex-col items-start justify-between">
          <div className="flex flex-col items-start gap-1 text-start">
            <p className="max-w-[15rem] truncate text-lg font-semibold leading-none text-white">
              {user?.name || user?.display_name}
            </p>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="markdown-simple line-clamp-6"
              disallowedElements={['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
              unwrapDisallowed={true}
              linkTarget={'_blank'}
            >
              {user?.about || user?.bio || 'No bio'}
            </ReactMarkdown>
          </div>
          <div className="flex flex-col gap-2">
            {user?.website ? (
              <Link
                to={user?.website}
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-white/70"
              >
                <WorldIcon className="h-4 w-4" />
                <p className="max-w-[10rem] truncate">{user.website}</p>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'simple') {
    return (
      <div className="flex items-center gap-2.5">
        <Image
          src={user?.picture || user?.image}
          alt={pubkey}
          className="h-12 w-12 shrink-0 rounded-lg object-cover"
        />
        <div className="flex w-full flex-col gap-1">
          <h3 className="max-w-[15rem] truncate font-medium leading-none text-white">
            {user?.name || user?.display_name}
          </h3>
          <p className="text-sm leading-none text-white/70">
            {user?.nip05 || user?.username || displayNpub(pubkey, 16)}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <Image
        src={user?.picture || user?.image}
        alt={pubkey}
        className="h-12 w-12 shrink-0 rounded-lg object-cover"
      />
    );
  }

  if (variant === 'repost') {
    return (
      <>
        <div className="flex gap-3">
          <Image
            src={user?.picture || user?.image}
            alt={pubkey}
            className="relative z-20 inline-block h-11 w-11 rounded-lg"
          />
          <div className="inline-flex items-baseline gap-1">
            <h5 className="max-w-[15rem] truncate font-semibold leading-none text-white">
              {user?.display_name || user?.name || displayNpub(pubkey, 16)}
            </h5>
            <span className="font-semibold text-fuchsia-500">reposted</span>
            <span className="leading-none text-white/50">·</span>
            <span className="leading-none text-white/50">{createdAt}</span>
          </div>
        </div>
        <div className="absolute left-[28px] top-16 h-6 w-0.5 bg-gradient-to-t from-white/20 to-white/10" />
      </>
    );
  }

  if (variant === 'thread') {
    return (
      <div className="flex items-center gap-3">
        <Image
          src={user?.picture || user?.image}
          alt={pubkey}
          className="relative z-20 inline-block h-11 w-11 rounded-lg"
        />
        <div className="flex flex-1 flex-col gap-2">
          <h5 className="max-w-[15rem] truncate font-semibold leading-none text-white">
            {user?.display_name || user?.name}
          </h5>
          <div className="inline-flex items-center gap-2">
            <span className="leading-none text-white/50">{createdAt}</span>
            <span className="leading-none text-white/50">·</span>
            <span className="leading-none text-white/50">{displayNpub(pubkey, 16)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Popover.Root>
      <div className="relative z-10 flex items-start gap-3">
        <Popover.Trigger asChild>
          <button
            type="button"
            className="relative z-40 h-11 w-11 shrink-0 overflow-hidden"
          >
            <Image
              src={user?.picture || user?.image}
              alt={pubkey}
              className="h-11 w-11 rounded-lg object-cover"
            />
          </button>
        </Popover.Trigger>
        <div className="flex flex-1 items-baseline gap-2">
          <h5 className="max-w-[15rem] truncate font-semibold leading-none text-white">
            {user?.display_name || user?.name || displayNpub(pubkey, 16)}
          </h5>
          <span className="leading-none text-white/50">·</span>
          <span className="leading-none text-white/50">{createdAt}</span>
        </div>
      </div>
      <Popover.Portal>
        <Popover.Content
          className="w-[300px] overflow-hidden rounded-xl border border-white/10 bg-white/10 backdrop-blur-3xl focus:outline-none"
          sideOffset={5}
        >
          <div className="flex gap-2.5 border-b border-white/5 px-3 py-3">
            <Image
              src={user?.picture || user?.image}
              alt={pubkey}
              className="h-11 w-11 shrink-0 rounded-lg object-cover"
            />
            <div className="flex flex-1 flex-col gap-2">
              <div className="inline-flex flex-col gap-1">
                <h5 className="text-sm font-semibold leading-none">
                  {user?.display_name || user?.name || user?.username}
                </h5>
                {user.nip05 ? (
                  <NIP05
                    pubkey={pubkey}
                    nip05={user.nip05}
                    className="max-w-[15rem] truncate text-sm leading-none text-white/50"
                  />
                ) : (
                  <span className="max-w-[15rem] truncate text-sm leading-none text-white/50">
                    {displayNpub(pubkey, 16)}
                  </span>
                )}
              </div>
              <div>
                <p className="line-clamp-3 break-all text-sm leading-tight text-white">
                  {user?.about}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-3">
            <Link
              to={`/users/${pubkey}`}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-white/10 text-sm font-semibold backdrop-blur-xl hover:bg-fuchsia-500"
            >
              View profile
            </Link>
            <Link
              to={`/chats/${pubkey}`}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-white/10 text-sm font-semibold backdrop-blur-xl hover:bg-fuchsia-500"
            >
              Message
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});
