import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { NoteSkeleton, NoteWrapper, TextNote } from '@shared/notes';
import { TitleBar } from '@shared/titleBar';

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
    <div className="relative shrink-0 grow-0 basis-[400px] bg-white/10 backdrop-blur-xl">
      <TitleBar id={params.id} title="Trending Notes" />
      <div className="scrollbar-hide h-full max-w-full overflow-y-auto pb-20">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
              <NoteSkeleton />
            </div>
          </div>
        ) : status === 'error' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
              <p className="text-center text-sm font-medium text-white">
                Sorry, an unexpected error has occurred.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative flex w-full flex-col">
            {data.map((item) => (
              <NoteWrapper key={item.event.id} event={item.event}>
                <TextNote content={item.event.content} />
              </NoteWrapper>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
