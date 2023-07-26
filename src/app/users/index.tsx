import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useNDK } from '@libs/ndk/provider';

import { NoteKind_1, NoteSkeleton } from '@shared/notes';

import { nHoursAgo } from '@utils/date';
import { LumeEvent } from '@utils/types';

import { UserProfile } from './components/profile';

export function UserScreen() {
  const parentRef = useRef();

  const { pubkey } = useParams();
  const { fetcher, relayUrls } = useNDK();
  const { status, data } = useQuery(['user-feed', pubkey], async () => {
    const events = await fetcher.fetchAllEvents(
      relayUrls,
      { kinds: [1], authors: [pubkey] },
      { since: nHoursAgo(48) },
      { sort: true }
    );
    return events as unknown as LumeEvent[];
  });

  const rowVirtualizer = useVirtualizer({
    count: data ? data.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400,
  });

  const itemsVirtualizer = rowVirtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className="scrollbar-hide h-full w-full overflow-y-auto">
      <div
        data-tauri-drag-region
        className="flex h-11 w-full items-center border-b border-zinc-900 px-3"
      />
      <UserProfile pubkey={pubkey} />
      <div className="mt-8 h-full w-full border-t border-zinc-900">
        <div className="flex flex-col justify-start gap-1 px-3 pt-4 text-start">
          <p className="text-lg font-semibold leading-none text-zinc-200">Latest posts</p>
          <span className="text-sm leading-none text-zinc-500">48 hours ago</span>
        </div>
        <div className="flex h-full max-w-[400px] flex-col justify-between gap-1.5 pb-4 pt-1.5">
          {status === 'loading' ? (
            <div className="px-3 py-1.5">
              <div className="shadow-input rounded-md bg-zinc-900 px-3 py-3 shadow-black/20">
                <NoteSkeleton />
              </div>
            </div>
          ) : itemsVirtualizer.length === 0 ? (
            <div className="px-3 py-1.5">
              <div className="rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 py-6">
                <div className="flex flex-col items-center gap-4">
                  <p className="text-center text-sm text-zinc-300">
                    No new posts about this hashtag in 48 hours ago
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="relative w-full"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              <div
                className="absolute left-0 top-0 w-full"
                style={{
                  transform: `translateY(${
                    itemsVirtualizer[0].start - rowVirtualizer.options.scrollMargin
                  }px)`,
                }}
              >
                {itemsVirtualizer.map((virtualRow) => (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                  >
                    <NoteKind_1 event={data[virtualRow.index]} />
                  </div>
                ))}
                <div className="h-10" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
