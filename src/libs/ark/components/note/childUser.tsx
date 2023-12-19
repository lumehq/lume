import * as Avatar from '@radix-ui/react-avatar';
import { useQuery } from '@tanstack/react-query';
import { minidenticon } from 'minidenticons';
import { useMemo } from 'react';
import { useArk } from '@libs/ark/provider';
import { displayNpub } from '@utils/formater';

export function NoteChildUser({ pubkey, subtext }: { pubkey: string; subtext: string }) {
  const ark = useArk();
  const fallbackName = useMemo(() => displayNpub(pubkey, 16), [pubkey]);
  const fallbackAvatar = useMemo(
    () => 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(pubkey, 90, 50)),
    [pubkey]
  );

  const { isLoading, data: user } = useQuery({
    queryKey: ['user', pubkey],
    queryFn: async () => {
      try {
        const profile = await ark.getUserProfile({ pubkey });

        if (!profile)
          throw new Error(
            `Cannot get metadata for ${pubkey}, will be retry after 10 seconds`
          );

        return profile;
      } catch (e) {
        throw new Error(e);
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });

  if (isLoading) {
    return (
      <>
        <Avatar.Root className="h-10 w-10 shrink-0">
          <Avatar.Image
            src={fallbackAvatar}
            alt={pubkey}
            className="h-10 w-10 rounded-lg bg-black object-cover dark:bg-white"
          />
        </Avatar.Root>
        <div className="absolute left-2 top-2 inline-flex items-center gap-1.5 font-semibold leading-tight">
          <div className="w-full max-w-[10rem] truncate">{fallbackName} </div>
          <div className="font-normal text-neutral-700 dark:text-neutral-300">
            {subtext}:
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Avatar.Root className="h-10 w-10 shrink-0">
        <Avatar.Image
          src={user?.picture || user?.image}
          alt={pubkey}
          loading="lazy"
          decoding="async"
          className="h-10 w-10 rounded-lg object-cover"
        />
        <Avatar.Fallback delayMs={300}>
          <img
            src={fallbackAvatar}
            alt={pubkey}
            className="h-10 w-10 rounded-lg bg-black dark:bg-white"
          />
        </Avatar.Fallback>
      </Avatar.Root>
      <div className="absolute left-2 top-2 inline-flex items-center gap-1.5 font-semibold leading-tight">
        <div className="w-full max-w-[10rem] truncate">
          {user?.display_name || user?.name || user?.displayName || fallbackName}{' '}
        </div>
        <div className="font-normal text-neutral-700 dark:text-neutral-300">
          {subtext}:
        </div>
      </div>
    </>
  );
}
