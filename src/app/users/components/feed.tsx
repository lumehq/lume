import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

import { useNDK } from '@libs/ndk/provider';

import { NoteSkeleton, TextNote } from '@shared/notes';

import { nHoursAgo } from '@utils/date';
import { LumeEvent } from '@utils/types';

export function UserFeed({ pubkey }: { pubkey: string }) {
  const parentRef = useRef();

  const { ndk } = useNDK();
  const { status, data } = useQuery(['user-feed', pubkey], async () => {
    const events = await ndk.fetchEvents({
      kinds: [1],
      authors: [pubkey],
      since: nHoursAgo(48),
    });
    return [...events] as unknown as LumeEvent[];
  });

  const rowVirtualizer = useVirtualizer({
    count: data ? data.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400,
  });

  const itemsVirtualizer = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="scrollbar-hide flex h-full w-full flex-col justify-between gap-1.5 overflow-y-auto pb-20 pt-1.5"
      style={{ contain: 'strict' }}
    >
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
                <TextNote event={data[virtualRow.index]} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
