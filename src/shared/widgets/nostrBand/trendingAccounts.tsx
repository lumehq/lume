import { useQuery } from '@tanstack/react-query';
import { VList } from 'virtua';

import { LoaderIcon } from '@shared/icons';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';
import { NostrBandUserProfile, type Profile } from '@shared/widgets/nostrBandUserProfile';

import { Widget } from '@utils/types';

interface Response {
  profiles: Array<{ pubkey: string }>;
}

export function TrendingAccountsWidget({ params }: { params: Widget }) {
  const { status, data } = useQuery(
    ['trending-profiles-widget'],
    async () => {
      const res = await fetch('https://api.nostr.band/v0/trending/profiles');
      if (!res.ok) {
        throw new Error('Error');
      }
      const json: Response = await res.json();
      if (!json.profiles) return [];
      return json.profiles;
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  return (
    <WidgetWrapper>
      <TitleBar id={params.id} title="Trending Accounts" />
      <div className="flex-1">
        {status === 'loading' ? (
          <div className="flex h-full w-full items-center justify-center ">
            <div className="inline-flex flex-col items-center justify-center gap-2">
              <LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-white" />
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-300">
                Loading trending accounts...
              </p>
            </div>
          </div>
        ) : status === 'error' ? (
          <div className="flex h-full w-full flex-col items-center justify-center px-3">
            <div className="flex flex-col items-center gap-4">
              <img src="/ghost.png" alt="empty feeds" className="h-16 w-16" />
              <div className="text-center">
                <h3 className="font-semibold leading-tight text-zinc-500 dark:text-zinc-300">
                  Sorry, an unexpected error has occurred.
                </h3>
              </div>
            </div>
          </div>
        ) : (
          <VList className="scrollbar-none h-full">
            {data.map((item: Profile) => (
              <NostrBandUserProfile key={item.pubkey} data={item} />
            ))}
            <div className="h-16" />
          </VList>
        )}
      </div>
    </WidgetWrapper>
  );
}
