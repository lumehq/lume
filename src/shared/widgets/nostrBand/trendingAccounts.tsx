import { useQuery } from '@tanstack/react-query';
import { VList } from 'virtua';
import { Widget } from '@libs/ark';
import { LoaderIcon } from '@shared/icons';
import { NostrBandUserProfile, type Profile } from '@shared/widgets';
import { WidgetProps } from '@utils/types';

interface Response {
  profiles: Array<{ pubkey: string }>;
}

export function TrendingAccountsWidget({ props }: { props: WidgetProps }) {
  const { status, data } = useQuery({
    queryKey: ['trending-users'],
    queryFn: async () => {
      const res = await fetch('https://api.nostr.band/v0/trending/profiles');
      if (!res.ok) {
        throw new Error('Error');
      }
      const json: Response = await res.json();
      if (!json.profiles) return [];
      return json.profiles;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return (
    <Widget.Root>
      <Widget.Header id={props.id} title="Trending Accounts" />
      <Widget.Content>
        <div className="flex-1">
          {status === 'pending' ? (
            <div className="flex h-full w-full items-center justify-center ">
              <div className="inline-flex flex-col items-center justify-center gap-2">
                <LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-white" />
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-300">
                  Loading trending accounts...
                </p>
              </div>
            </div>
          ) : status === 'error' ? (
            <div className="flex h-full w-full flex-col items-center justify-center px-3">
              <div className="flex flex-col items-center gap-4">
                <img src="/ghost.png" alt="empty feeds" className="h-16 w-16" />
                <div className="text-center">
                  <h3 className="font-semibold leading-tight text-neutral-500 dark:text-neutral-300">
                    Sorry, an unexpected error has occurred.
                  </h3>
                </div>
              </div>
            </div>
          ) : (
            <VList className="h-full">
              {data.map((item: Profile) => (
                <NostrBandUserProfile key={item.pubkey} data={item} />
              ))}
              <div className="h-16" />
            </VList>
          )}
        </div>
      </Widget.Content>
    </Widget.Root>
  );
}
