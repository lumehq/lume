import * as Avatar from '@radix-ui/react-avatar';
import * as HoverCard from '@radix-ui/react-hover-card';
import { minidenticon } from 'minidenticons';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { RepostIcon, WorldIcon } from '@shared/icons';
import { NIP05 } from '@shared/nip05';
import { MoreActions } from '@shared/notes';

import { formatCreatedAt } from '@utils/createdAt';
import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export const User = memo(function User({
  pubkey,
  eventId,
  time,
  variant = 'default',
  embedProfile,
}: {
  pubkey: string;
  eventId?: string;
  time?: number;
  variant?:
    | 'default'
    | 'simple'
    | 'mention'
    | 'notify'
    | 'repost'
    | 'chat'
    | 'large'
    | 'thread'
    | 'miniavatar'
    | 'avatar'
    | 'stacked'
    | 'ministacked';
  embedProfile?: string;
}) {
  const { status, user } = useProfile(pubkey, embedProfile);

  const createdAt = formatCreatedAt(time, variant === 'chat');
  const svgURI =
    'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(pubkey, 90, 50));

  if (variant === 'mention') {
    if (status === 'pending') {
      return (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 shrink-0 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-3.5 w-36 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
        </div>
      );
    }

    return (
      <div className="flex h-6 items-center gap-2">
        <Avatar.Root className="shrink-0">
          <Avatar.Image
            src={user?.picture || user?.image}
            alt={pubkey}
            loading="lazy"
            decoding="async"
            style={{ contentVisibility: 'auto' }}
            className="h-6 w-6 rounded-md"
          />
          <Avatar.Fallback delayMs={300}>
            <img
              src={svgURI}
              alt={pubkey}
              className="h-6 w-6 rounded-md bg-black dark:bg-white"
            />
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex flex-1 items-baseline gap-2">
          <h5 className="max-w-[10rem] truncate font-semibold text-neutral-900 dark:text-neutral-100">
            {user?.name ||
              user?.display_name ||
              user?.displayName ||
              displayNpub(pubkey, 16)}
          </h5>
          <span className="text-neutral-600 dark:text-neutral-400">·</span>
          <span className="text-neutral-600 dark:text-neutral-400">{createdAt}</span>
        </div>
      </div>
    );
  }

  if (variant === 'notify') {
    if (status === 'pending') {
      return (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 shrink-0 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-3.5 w-36 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Avatar.Root className="shrink-0">
          <Avatar.Image
            src={user?.picture || user?.image}
            alt={pubkey}
            loading="lazy"
            decoding="async"
            style={{ contentVisibility: 'auto' }}
            className="h-8 w-8 rounded-md"
          />
          <Avatar.Fallback delayMs={300}>
            <img
              src={svgURI}
              alt={pubkey}
              className="h-8 w-8 rounded-md bg-black dark:bg-white"
            />
          </Avatar.Fallback>
        </Avatar.Root>
        <h5 className="max-w-[10rem] truncate font-medium text-neutral-900 dark:text-neutral-100">
          {user?.name ||
            user?.display_name ||
            user?.displayName ||
            displayNpub(pubkey, 16)}
        </h5>
      </div>
    );
  }

  if (variant === 'large') {
    if (status === 'pending') {
      return (
        <div className="flex items-center gap-2.5">
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-neutral-300 dark:bg-neutral-700" />
          <div>
            <div className="h-3.5 w-36 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full w-full flex-col gap-2.5">
        <Avatar.Root className="shrink-0">
          <Avatar.Image
            src={user?.picture || user?.image}
            alt={pubkey}
            loading="lazy"
            decoding="async"
            style={{ contentVisibility: 'auto' }}
            className="h-14 w-14 rounded-lg"
          />
          <Avatar.Fallback delayMs={300}>
            <img
              src={svgURI}
              alt={pubkey}
              className="h-14 w-14 rounded-lg bg-black dark:bg-white"
            />
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex h-full flex-col items-start justify-between">
          <div className="flex flex-col items-start gap-1 text-start">
            <p className="max-w-[15rem] truncate text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {user?.name || user?.display_name || user?.displayName}
            </p>
            <p className="break-p prose prose-neutral max-w-none select-text whitespace-pre-line leading-normal dark:prose-invert prose-headings:mb-1 prose-headings:mt-3 prose-p:mb-0 prose-p:mt-0 prose-p:last:mb-1 prose-a:font-normal prose-a:text-blue-500 prose-blockquote:mb-1 prose-blockquote:mt-1 prose-blockquote:border-l-[2px] prose-blockquote:border-blue-500 prose-blockquote:pl-2 prose-pre:whitespace-pre-wrap prose-pre:bg-white/10 prose-ol:m-0 prose-ol:mb-1 prose-ul:mb-1 prose-ul:mt-1 prose-img:mb-2 prose-img:mt-3 prose-hr:mx-0 prose-hr:my-2 hover:prose-a:text-blue-500">
              {user?.about || user?.bio || 'No bio'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {user?.website ? (
              <Link
                to={user?.website}
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100/70"
              >
                <WorldIcon className="h-4 w-4" />
                <p className="max-w-[10rem] truncate">{user?.website}</p>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'simple') {
    if (status === 'pending') {
      return (
        <div className="flex items-center gap-2.5">
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-neutral-300 dark:bg-neutral-700" />
          <div className="flex w-full flex-col items-start gap-1">
            <div className="h-4 w-36 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2.5">
        <Avatar.Root className="shrink-0">
          <Avatar.Image
            src={user?.picture || user?.image}
            alt={pubkey}
            loading="lazy"
            decoding="async"
            style={{ contentVisibility: 'auto' }}
            className="h-11 w-11 rounded-lg"
          />
          <Avatar.Fallback delayMs={300}>
            <img
              src={svgURI}
              alt={pubkey}
              className="h-11 w-11 rounded-lg bg-black dark:bg-white"
            />
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex w-full flex-col items-start">
          <h3 className="max-w-[15rem] truncate text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {user?.name || user?.display_name || user?.displayName}
          </h3>
          <p className="max-w-[10rem] truncate text-sm text-neutral-900 dark:text-neutral-100/70">
            {user?.nip05 || user?.username || displayNpub(pubkey, 16)}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    if (status === 'pending') {
      return (
        <div className="h-12 w-12 animate-pulse rounded-lg bg-neutral-300 dark:bg-neutral-700" />
      );
    }

    return (
      <Avatar.Root>
        <Avatar.Image
          src={user?.picture || user?.image}
          alt={pubkey}
          loading="lazy"
          decoding="async"
          style={{ contentVisibility: 'auto' }}
          className="h-12 w-12 rounded-lg"
        />
        <Avatar.Fallback delayMs={300}>
          <img
            src={svgURI}
            alt={pubkey}
            className="h-12 w-12 rounded-lg bg-black dark:bg-white"
          />
        </Avatar.Fallback>
      </Avatar.Root>
    );
  }

  if (variant === 'miniavatar') {
    if (status === 'pending') {
      return (
        <div className="h-10 w-10 animate-pulse rounded-lg bg-neutral-300 dark:bg-neutral-700" />
      );
    }

    return (
      <Avatar.Root>
        <Avatar.Image
          src={user?.picture || user?.image}
          alt={pubkey}
          loading="lazy"
          decoding="async"
          style={{ contentVisibility: 'auto' }}
          className="h-10 w-10 rounded-lg"
        />
        <Avatar.Fallback delayMs={300}>
          <img
            src={svgURI}
            alt={pubkey}
            className="h-10 w-10 rounded-lg bg-black dark:bg-white"
          />
        </Avatar.Fallback>
      </Avatar.Root>
    );
  }

  if (variant === 'stacked') {
    if (status === 'pending') {
      return (
        <div className="inline-block h-8 w-8 animate-pulse rounded-full bg-neutral-300 ring-1 ring-neutral-200 dark:bg-neutral-700 dark:ring-neutral-800" />
      );
    }

    return (
      <Avatar.Root>
        <Avatar.Image
          src={user?.picture || user?.image}
          alt={pubkey}
          loading="lazy"
          decoding="async"
          style={{ contentVisibility: 'auto' }}
          className="inline-block h-8 w-8 rounded-full ring-1 ring-neutral-200 dark:ring-neutral-800"
        />
        <Avatar.Fallback delayMs={300}>
          <img
            src={svgURI}
            alt={pubkey}
            className="inline-block h-8 w-8 rounded-full bg-black ring-1 ring-neutral-200 dark:bg-white dark:ring-neutral-800"
          />
        </Avatar.Fallback>
      </Avatar.Root>
    );
  }

  if (variant === 'ministacked') {
    if (status === 'pending') {
      return (
        <div className="inline-block h-6 w-6 animate-pulse rounded-full bg-neutral-300 ring-1 ring-white dark:ring-black" />
      );
    }

    return (
      <Avatar.Root>
        <Avatar.Image
          src={user?.picture || user?.image}
          alt={pubkey}
          loading="lazy"
          decoding="async"
          style={{ contentVisibility: 'auto' }}
          className="inline-block h-6 w-6 rounded-full ring-1 ring-white dark:ring-black"
        />
        <Avatar.Fallback delayMs={300}>
          <img
            src={svgURI}
            alt={pubkey}
            className="inline-block h-6 w-6 rounded-full bg-black ring-1 ring-white dark:bg-white dark:ring-black"
          />
        </Avatar.Fallback>
      </Avatar.Root>
    );
  }

  if (variant === 'repost') {
    if (status === 'pending') {
      return (
        <div className="flex gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center">
            <RepostIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="inline-flex items-center gap-2">
            <div className="h-6 w-6 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center">
          <RepostIcon className="h-5 w-5 text-blue-500" />
        </div>
        <div className="inline-flex items-center gap-2">
          <Avatar.Root className="shrink-0">
            <Avatar.Image
              src={user?.picture || user?.image}
              alt={pubkey}
              loading="lazy"
              decoding="async"
              style={{ contentVisibility: 'auto' }}
              className="h-6 w-6 rounded"
            />
            <Avatar.Fallback delayMs={300}>
              <img
                src={svgURI}
                alt={pubkey}
                className="h-6 w-6 rounded bg-black dark:bg-white"
              />
            </Avatar.Fallback>
          </Avatar.Root>
          <div className="inline-flex items-baseline gap-1">
            <h5 className="max-w-[10rem] truncate font-medium text-neutral-900 dark:text-neutral-100/80">
              {user?.name ||
                user?.display_name ||
                user?.displayName ||
                displayNpub(pubkey, 16)}
            </h5>
            <span className="text-blue-500">reposted</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'thread') {
    if (status === 'pending') {
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-neutral-300 dark:bg-neutral-700" />
          <div className="flex flex-1 flex-col">
            <div className="h-4 w-36 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <Avatar.Root className="h-10 w-10 shrink-0">
          <Avatar.Image
            src={user?.picture || user?.image}
            alt={pubkey}
            loading="lazy"
            decoding="async"
            style={{ contentVisibility: 'auto' }}
            className="h-10 w-10 rounded-lg"
          />
          <Avatar.Fallback delayMs={300}>
            <img
              src={svgURI}
              alt={pubkey}
              className="h-10 w-10 rounded-lg bg-black dark:bg-white"
            />
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex flex-1 flex-col">
          <h5 className="max-w-[15rem] truncate font-semibold text-neutral-900 dark:text-neutral-100">
            {user?.name || user?.display_name || user?.displayName || 'Anon'}
          </h5>
          <div className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <span>{createdAt}</span>
            <span>·</span>
            <span>{displayNpub(pubkey, 16)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-neutral-300 dark:bg-neutral-700" />
        <div className="h-6 flex-1">
          <div className="h-4 w-36 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
        </div>
      </div>
    );
  }

  return (
    <HoverCard.Root>
      <div className="relative z-10 flex items-start gap-3">
        <HoverCard.Trigger asChild>
          <Avatar.Root className="relative top-1 h-10 w-10 shrink-0">
            <Avatar.Image
              src={user?.picture || user?.image}
              alt={pubkey}
              loading="lazy"
              decoding="async"
              style={{ contentVisibility: 'auto' }}
              className="h-10 w-10 rounded-lg bg-white object-cover"
            />
            <Avatar.Fallback delayMs={300}>
              <img
                src={svgURI}
                alt={pubkey}
                className="h-10 w-10 rounded-lg bg-black dark:bg-white"
              />
            </Avatar.Fallback>
          </Avatar.Root>
        </HoverCard.Trigger>
        <div className="flex h-6 flex-1 items-start gap-2">
          <div className="max-w-[15rem] truncate font-semibold text-neutral-950 dark:text-neutral-50">
            {user?.name ||
              user?.display_name ||
              user?.displayName ||
              displayNpub(pubkey, 16)}
          </div>
          <div className="ml-auto inline-flex items-center gap-3">
            <div className="text-neutral-500 dark:text-neutral-400">{createdAt}</div>
            <MoreActions id={eventId} pubkey={pubkey} />
          </div>
        </div>
      </div>
      <HoverCard.Portal>
        <HoverCard.Content
          className="ml-4 w-[300px] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-lg data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all focus:outline-none dark:border-neutral-800 dark:bg-neutral-900"
          sideOffset={5}
        >
          <div className="flex gap-2.5 border-b border-neutral-200 px-3 py-3 dark:border-neutral-800">
            <Avatar.Root className="shrink-0">
              <Avatar.Image
                src={user?.picture || user?.image}
                alt={pubkey}
                loading="lazy"
                decoding="async"
                style={{ contentVisibility: 'auto' }}
                className="h-10 w-10 rounded-lg"
              />
              <Avatar.Fallback delayMs={300}>
                <img
                  src={svgURI}
                  alt={pubkey}
                  className="h-10 w-10 rounded-lg bg-black dark:bg-white"
                />
              </Avatar.Fallback>
            </Avatar.Root>
            <div className="flex flex-1 flex-col gap-2">
              <div className="inline-flex flex-col gap-1">
                <h5 className="text-sm font-semibold">
                  {user?.name ||
                    user?.display_name ||
                    user?.displayName ||
                    user?.username}
                </h5>
                {user?.nip05 ? (
                  <NIP05
                    pubkey={pubkey}
                    nip05={user?.nip05}
                    className="max-w-[15rem] truncate text-sm text-neutral-500 dark:text-neutral-300"
                  />
                ) : (
                  <span className="max-w-[15rem] truncate text-sm text-neutral-500 dark:text-neutral-300">
                    {displayNpub(pubkey, 16)}
                  </span>
                )}
              </div>
              <div>
                <p className="line-clamp-3 break-all text-sm leading-tight text-neutral-900 dark:text-neutral-100">
                  {user?.about}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-3">
            <Link
              to={`/users/${pubkey}`}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-neutral-200 text-sm font-semibold hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
            >
              View profile
            </Link>
            <Link
              to={`/chats/${pubkey}`}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-neutral-200 text-sm font-semibold hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
            >
              Message
            </Link>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
});
