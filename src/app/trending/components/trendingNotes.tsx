import { useQuery } from '@tanstack/react-query';

import { Note } from '@shared/notes/note';
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
    <div className="flex w-[360px] shrink-0 flex-col border-r border-zinc-900">
      <TitleBar title="Trending Posts" />
      <div className="scrollbar-hide flex h-full w-full flex-col justify-between gap-1.5 overflow-y-auto pb-20 pt-1.5">
        {error && <p>Failed to fetch</p>}
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="shadow-input rounded-md bg-zinc-900 px-3 py-3 shadow-black/20">
              <NoteSkeleton />
            </div>
          </div>
        ) : (
          <div className="relative flex w-full flex-col pt-1.5">
            {data.notes.map((item) => (
              <Note key={item.id} event={item.event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
