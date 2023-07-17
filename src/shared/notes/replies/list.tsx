import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';

import { Reply } from '@shared/notes/replies/item';

import { LumeEvent } from '@utils/types';

export function RepliesList({ id }: { id: string }) {
  const { relayUrls, fetcher } = useNDK();
  const { status, data } = useQuery(['thread', id], async () => {
    const events = (await fetcher.fetchAllEvents(
      relayUrls,
      { kinds: [1], '#e': [id] },
      { since: 0 }
    )) as unknown as LumeEvent[];
    return events;
  });

  return (
    <div className="mt-3">
      <div className="mb-2">
        <h5 className="text-lg font-semibold text-zinc-300">Replies</h5>
      </div>
      <div className="flex flex-col">
        {status === 'loading' ? (
          <div className="flex gap-2 px-3 py-4">
            <div className="relative h-9 w-9 shrink animate-pulse rounded-md bg-zinc-800" />
            <div className="flex w-full flex-1 flex-col justify-center gap-1">
              <div className="flex items-baseline gap-2 text-base">
                <div className="h-2.5 w-20 animate-pulse rounded-sm bg-zinc-800" />
              </div>
              <div className="h-4 w-44 animate-pulse rounded-sm bg-zinc-800" />
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="px=3">
            <div className="flex w-full items-center justify-center rounded-xl bg-zinc-900">
              <div className="flex flex-col items-center justify-center gap-2 py-6">
                <h3 className="text-3xl">👋</h3>
                <p className="leading-none text-zinc-400">Share your thought on it...</p>
              </div>
            </div>
          </div>
        ) : (
          data.map((event: NDKEvent) => <Reply key={event.id} data={event} />)
        )}
      </div>
    </div>
  );
}
