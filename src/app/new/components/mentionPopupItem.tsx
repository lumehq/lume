import * as Avatar from '@radix-ui/react-avatar';
import { minidenticon } from 'minidenticons';
import { useMemo } from 'react';
import { displayNpub } from '@utils/formater';
import { useProfile } from '@utils/hooks/useProfile';

export function MentionPopupItem({ pubkey, embed }: { pubkey: string; embed?: string }) {
  const { isLoading, user } = useProfile(pubkey, embed);
  const svgURI = useMemo(
    () => 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(pubkey, 90, 50)),
    [pubkey]
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2.5 px-2">
        <div className="relative h-8 w-8 shrink-0 animate-pulse rounded bg-neutral-400 dark:bg-neutral-600" />
        <div className="flex w-full flex-1 flex-col items-start gap-1 text-start">
          <span className="h-4 w-1/2 animate-pulse rounded bg-neutral-400 dark:bg-neutral-600" />
          <span className="h-3 w-1/3 animate-pulse rounded bg-neutral-400 dark:bg-neutral-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-11 items-center justify-start gap-2.5 px-2 hover:bg-neutral-200 dark:bg-neutral-800">
      <Avatar.Root className="shirnk-0 h-8 w-8">
        <Avatar.Image
          src={user?.picture || user?.image}
          alt={pubkey}
          loading="lazy"
          decoding="async"
          className="h-8 w-8 rounded-md object-cover"
        />
        <Avatar.Fallback delayMs={300}>
          <img
            src={svgURI}
            alt={pubkey}
            className="h-8 w-8 rounded-md bg-black dark:bg-white"
          />
        </Avatar.Fallback>
      </Avatar.Root>
      <div className="flex flex-col items-start gap-px">
        <h5 className="max-w-[10rem] truncate text-sm font-medium leading-none text-neutral-900 dark:text-neutral-100">
          {user?.display_name || user?.displayName || user?.name}
        </h5>
        <span className="text-sm leading-none text-neutral-600 dark:text-neutral-400">
          {displayNpub(pubkey, 16)}
        </span>
      </div>
    </div>
  );
}
