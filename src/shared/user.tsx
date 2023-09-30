import * as Avatar from '@radix-ui/react-avatar';
import * as HoverCard from '@radix-ui/react-hover-card';
import { minidenticon } from 'minidenticons';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

import { RepostIcon, WorldIcon } from '@shared/icons';
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
    | 'avatar'
    | 'stacked';
  embedProfile?: string;
}) {
  const { status, user } = useProfile(pubkey, embedProfile);

  const createdAt = formatCreatedAt(time, variant === 'chat');
  const svgURI =
    'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(pubkey, 90, 50));

  if (status === 'loading') {
    if (variant === 'avatar') {
      return (
        <div className="h-12 w-12 animate-pulse overflow-hidden rounded-lg bg-white/10 backdrop-blur-xl" />
      );
    }

    if (variant === 'mention') {
      return (
        <div className="relative flex items-center gap-3">
          <div className="relative z-10 h-6 w-6 shrink-0 animate-pulse overflow-hidden rounded bg-white/10 backdrop-blur-xl" />
          <div className="h-3.5 w-36 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
        </div>
      );
    }

    return (
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-white/10 backdrop-blur-xl" />
        <div className="h-3.5 w-36 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
      </div>
    );
  }

  if (variant === 'mention') {
    return (
      <div className="flex items-center gap-2">
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
            <img src={svgURI} alt={pubkey} className="h-6 w-6 rounded bg-black" />
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex flex-1 items-baseline gap-2">
          <h5 className="max-w-[10rem] truncate font-semibold leading-none text-white">
            {user?.name ||
              user?.display_name ||
              user?.displayName ||
              displayNpub(pubkey, 16)}
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
            <img src={svgURI} alt={pubkey} className="h-14 w-14 rounded-lg bg-black" />
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex h-full flex-col items-start justify-between">
          <div className="flex flex-col items-start gap-1 text-start">
            <p className="max-w-[15rem] truncate text-lg font-semibold leading-none text-white">
              {user?.name || user?.display_name || user?.displayName}
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
                <p className="max-w-[10rem] truncate">{user?.website}</p>
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
            <img src={svgURI} alt={pubkey} className="h-10 w-10 rounded-lg bg-black" />
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex w-full flex-col items-start gap-1">
          <h3 className="max-w-[15rem] truncate font-medium leading-none text-white">
            {user?.name || user?.display_name || user?.displayName}
          </h3>
          <p className="max-w-[10rem] truncate text-sm leading-none text-white/70">
            {user?.nip05 || user?.username || displayNpub(pubkey, 16)}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
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
          <img src={svgURI} alt={pubkey} className="h-12 w-12 rounded-lg bg-black" />
        </Avatar.Fallback>
      </Avatar.Root>
    );
  }

  if (variant === 'stacked') {
    return (
      <Avatar.Root>
        <Avatar.Image
          src={user?.picture || user?.image}
          alt={pubkey}
          loading="lazy"
          decoding="async"
          style={{ contentVisibility: 'auto' }}
          className="inline-block h-8 w-8 rounded-full ring-1 ring-black"
        />
        <Avatar.Fallback delayMs={300}>
          <img
            src={svgURI}
            alt={pubkey}
            className="inline-block h-8 w-8 rounded-full bg-black ring-1 ring-black"
          />
        </Avatar.Fallback>
      </Avatar.Root>
    );
  }

  if (variant === 'repost') {
    return (
      <div className="flex gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center">
          <RepostIcon className="h-6 w-6 text-blue-500" />
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
              <img src={svgURI} alt={pubkey} className="h-6 w-6 rounded bg-black" />
            </Avatar.Fallback>
          </Avatar.Root>
          <div className="inline-flex items-baseline gap-1">
            <h5 className="max-w-[10rem] truncate font-medium leading-none text-white/80">
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
    return (
      <div className="flex items-center gap-3">
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
            <img src={svgURI} alt={pubkey} className="h-10 w-10 rounded-lg bg-black" />
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex flex-1 flex-col gap-2">
          <h5 className="max-w-[15rem] truncate font-semibold leading-none text-white">
            {user?.name || user?.display_name || user?.displayName || 'Anon'}
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
    <HoverCard.Root>
      <div className="relative z-10 flex items-start gap-3">
        <HoverCard.Trigger asChild>
          <Avatar.Root className="shrink-0">
            <Avatar.Image
              src={user?.picture || user?.image}
              alt={pubkey}
              loading="lazy"
              decoding="async"
              style={{ contentVisibility: 'auto' }}
              className="h-10 w-10 rounded-lg border border-white/5"
            />
            <Avatar.Fallback delayMs={300}>
              <img
                src={svgURI}
                alt={pubkey}
                className="h-10 w-10 rounded-lg border border-white/5 bg-black"
              />
            </Avatar.Fallback>
          </Avatar.Root>
        </HoverCard.Trigger>
        <div className="flex flex-1 items-baseline gap-2">
          <h5 className="max-w-[15rem] truncate font-semibold leading-none text-white">
            {user?.name ||
              user?.display_name ||
              user?.displayName ||
              displayNpub(pubkey, 16)}
          </h5>
          <span className="leading-none text-white/50">·</span>
          <span className="leading-none text-white/50">{createdAt}</span>
        </div>
      </div>
      <HoverCard.Portal>
        <HoverCard.Content
          className="w-[300px] overflow-hidden rounded-xl border border-white/10 bg-white/10 backdrop-blur-3xl focus:outline-none data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
          sideOffset={5}
        >
          <div className="flex gap-2.5 border-b border-white/5 px-3 py-3">
            <Avatar.Root className="shrink-0">
              <Avatar.Image
                src={user?.picture || user?.image}
                alt={pubkey}
                loading="lazy"
                decoding="async"
                style={{ contentVisibility: 'auto' }}
                className="h-10 w-10 rounded-lg border border-white/5"
              />
              <Avatar.Fallback delayMs={300}>
                <img
                  src={svgURI}
                  alt={pubkey}
                  className="h-10 w-10 rounded-lg border border-white/5 bg-black"
                />
              </Avatar.Fallback>
            </Avatar.Root>
            <div className="flex flex-1 flex-col gap-2">
              <div className="inline-flex flex-col gap-1">
                <h5 className="text-sm font-semibold leading-none">
                  {user?.name ||
                    user?.display_name ||
                    user?.displayName ||
                    user?.username}
                </h5>
                {user?.nip05 ? (
                  <NIP05
                    pubkey={pubkey}
                    nip05={user?.nip05}
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
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
});
