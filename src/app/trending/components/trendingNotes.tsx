import { useQuery } from '@tanstack/react-query';

import { NoteKind_1 } from '@shared/notes';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';

import { LumeEvent } from '@utils/types';

interface Response {
  notes: Array<{ event: LumeEvent }>;
}

export function TrendingNotes() {
  const { status, data, error } = useQuery(
    ['trending-notes'],
    async () => {
      const res = await fetch('https://api.nostr.band/v0/trending/notes');
      if (!res.ok) {
        throw new Error('Error');
      }
      const json: Response = await res.json();
      return json.notes;
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  console.log('notes: ', data);

  return (
    <div className="scrollbar-hide relative h-full w-[400px] shrink-0 overflow-y-auto bg-white/10 pb-20">
      <TitleBar title="Trending Posts" />
      <div className="h-full">
        {error && <p>Failed to fetch</p>}
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        ) : (
          <div className="relative flex w-full flex-col">
            {data.map((item) => (
              <NoteKind_1 key={item.event.id} event={item.event} skipMetadata={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
