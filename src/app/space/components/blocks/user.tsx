import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

import { useNDK } from '@libs/ndk/provider';

import { NoteKind_1, NoteSkeleton } from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { UserProfile } from '@shared/userProfile';

import { nHoursAgo } from '@utils/date';
import { Block, LumeEvent } from '@utils/types';

export function UserBlock({ params }: { params: Block }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const { fetcher, relayUrls } = useNDK();
  const { status, data } = useQuery(['user-feed', params.content], async () => {
    const events = await fetcher.fetchAllEvents(
      relayUrls,
      { kinds: [1], authors: [params.content] },
      { since: nHoursAgo(48) },
      { sort: true }
    );
    return events as unknown as LumeEvent[];
  });

  const rowVirtualizer = useVirtualizer({
    count: data ? data.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400,
    overscan: 2,
  });

  const itemsVirtualizer = rowVirtualizer.getVirtualItems();

  return (
    <div className="h-full w-[400px] shrink-0 border-r border-zinc-900">
      <TitleBar id={params.id} title={params.title} />
      <div
        ref={parentRef}
        className="scrollbar-hide flex h-full flex-1 flex-col gap-1.5 overflow-y-auto pt-1.5"
      >
        <div className="px-3 pt-1.5">
          <UserProfile pubkey={params.content} />
        </div>
        <div>
          <h3 className="mt-2 px-3 text-lg font-semibold text-zinc-300">
            Latest activities
          </h3>
          <div className="flex h-full w-full flex-col justify-between gap-1.5 pb-10">
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
                  <div className="h-20" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
