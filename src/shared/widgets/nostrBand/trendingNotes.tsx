import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { VList } from 'virtua';

import { LoaderIcon } from '@shared/icons';
import { MemoizedTextNote } from '@shared/notes';
import { TitleBar, WidgetWrapper } from '@shared/widgets';

import { Widget } from '@utils/types';

interface Response {
  notes: Array<{ event: NDKEvent }>;
}

export function TrendingNotesWidget({ widget }: { widget: Widget }) {
  const { status, data } = useQuery({
    queryKey: ['trending-posts'],
    queryFn: async () => {
      const res = await fetch('https://api.nostr.band/v0/trending/notes');
      if (!res.ok) {
        throw new Error('failed to fecht trending notes');
      }
      const json: Response = await res.json();
      if (!json.notes) return null;
      return json.notes;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return (
    <WidgetWrapper>
      <TitleBar id={widget.id} title="Trending Notes" />
      <VList className="flex-1">
        {status === 'pending' ? (
          <div className="flex h-full w-full items-center justify-center ">
            <div className="inline-flex flex-col items-center justify-center gap-2">
              <LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-white" />
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-300">
                Loading trending posts...
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
          data.map((item) => <MemoizedTextNote key={item.event.id} event={item.event} />)
        )}
      </VList>
    </WidgetWrapper>
  );
}
