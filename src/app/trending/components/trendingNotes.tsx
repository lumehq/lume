import { useQuery } from '@tanstack/react-query';

import { NoteKind_1 } from '@shared/notes';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';

export function TrendingNotes() {
  const { status, data, error } = useQuery(['trending-notes'], async () => {
    const res = await fetch('https://api.nostr.band/v0/trending/notes');
    if (!res.ok) {
      throw new Error('Error');
    }
    return res.json();
  });

  return (
    <div className="scrollbar-hide relative h-full w-[400px] shrink-0 overflow-y-auto bg-white/10 pb-20">
      <TitleBar title="Trending Posts" />
      <div className="h-full">
        {error && <p>Failed to fetch</p>}
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="shadow-input rounded-md px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        ) : (
          <div className="relative flex w-full flex-col">
            {data.notes.map((item) => (
              <NoteKind_1 key={item.id} event={item.event} skipMetadata={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
