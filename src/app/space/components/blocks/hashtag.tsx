import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

import { useNDK } from '@libs/ndk/provider';

import { NoteKind_1, NoteSkeleton } from '@shared/notes';
import { TitleBar } from '@shared/titleBar';

import { nHoursAgo } from '@utils/date';
import { Block, LumeEvent } from '@utils/types';

export function HashtagBlock({ params }: { params: Block }) {
  const { relayUrls, fetcher } = useNDK();
  const { status, data } = useQuery(['hashtag', params.content], async () => {
    const events = (await fetcher.fetchAllEvents(
      relayUrls,
      { kinds: [1], '#t': [params.content] },
      { since: nHoursAgo(24) }
    )) as unknown as LumeEvent[];
    return events;
  });

  const parentRef = useRef();
  const rowVirtualizer = useVirtualizer({
    count: data ? data.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400,
  });

  const itemsVirtualizer = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div className="relative w-[400px] shrink-0 bg-white/10">
      <TitleBar id={params.id} title={params.title + ' in 24 hours ago'} />
      <div ref={parentRef} className="scrollbar-hide h-full overflow-y-auto pb-20">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        ) : itemsVirtualizer.length === 0 ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-6">
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-sm font-medium text-white">
                  No new posts about this hashtag in 24 hours ago
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="relative w-full"
            style={{
              height: `${totalSize}px`,
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
