import { useQuery } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';

import { useArk } from '@libs/ark';

import { LoaderIcon } from '@shared/icons';

import { compactNumber } from '@utils/number';

export function ZapCard() {
  const { ark } = useArk();
  const { status, data } = useQuery({
    queryKey: ['user-stats', ark.account.pubkey],
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const res = await fetch(
        `https://api.nostr.band/v0/stats/profile/${ark.account.pubkey}`,
        {
          signal,
        }
      );

      if (!res.ok) {
        throw new Error('Error');
      }

      return await res.json();
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  return (
    <div className="col-span-1 h-44 rounded-2xl bg-neutral-100 transition-all duration-150 ease-smooth hover:scale-105 dark:bg-neutral-900">
      {status === 'pending' ? (
        <div className="flex h-full w-full items-center justify-center">
          <LoaderIcon className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div className="flex h-full w-full flex-col justify-between p-4">
          <h3 className="pt-1 text-5xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
            {compactNumber.format(
              data?.stats[ark.account.pubkey]?.zaps_received?.msats / 1000 || 0
            )}
          </h3>
          <div className="mt-auto flex h-6 items-center text-xl font-medium leading-none text-neutral-600 dark:text-neutral-400">
            Sats received
          </div>
        </div>
      )}
    </div>
  );
}
