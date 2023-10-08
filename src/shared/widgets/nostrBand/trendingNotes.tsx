import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { VList } from 'virtua';

import { LoaderIcon } from '@shared/icons';
import { NoteWrapper, TextNote } from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { Widget } from '@utils/types';

interface Response {
  notes: Array<{ event: NDKEvent }>;
}

export function TrendingNotesWidget({ params }: { params: Widget }) {
  const { status, data } = useQuery(
    ['trending-notes-widget'],
    async () => {
      const res = await fetch('https://api.nostr.band/v0/trending/notes');
      if (!res.ok) {
        throw new Error('failed to fecht trending notes');
      }
      const json: Response = await res.json();
      if (!json.notes) return null;
      return json.notes;
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
      <TitleBar id={params.id} title="Trending Notes" />
      <div className="flex-1">
        {status === 'loading' ? (
          <div className="flex h-full w-full items-center justify-center ">
            <div className="inline-flex flex-col items-center justify-center gap-2">
              <LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-white" />
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-300">
                Loading trending posts...
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
          <VList className="scrollbar-hide h-full">
            {data.map((item) => (
              <NoteWrapper key={item.event.id} event={item.event}>
                <TextNote content={item.event.content} />
              </NoteWrapper>
            ))}
            <div className="h-16" />
          </VList>
        )}
      </div>
    </WidgetWrapper>
  );
}
