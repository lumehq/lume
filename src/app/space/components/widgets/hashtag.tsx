import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useRef } from 'react';

import { useNDK } from '@libs/ndk/provider';

import { NoteKind_1, NoteSkeleton, Repost } from '@shared/notes';
import { NoteKindUnsupport } from '@shared/notes/kinds/unsupport';
import { TitleBar } from '@shared/titleBar';

import { nHoursAgo } from '@utils/date';
import { Widget } from '@utils/types';

export function HashtagWidget({ params }: { params: Widget }) {
  const { ndk } = useNDK();
  const { status, data } = useQuery(['hashtag-widget', params.content], async () => {
    const events = await ndk.fetchEvents({
      kinds: [1],
      '#t': [params.content],
      since: nHoursAgo(24),
    });
    return [...events] as unknown as NDKEvent[];
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: data ? data.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 650,
    overscan: 4,
  });
  const items = virtualizer.getVirtualItems();

  // render event match event kind
  const renderItem = useCallback(
    (index: string | number) => {
      const event: NDKEvent = data[index];
      if (!event) return;

      switch (event.kind) {
        case 1:
          return (
            <div key={event.id} data-index={index} ref={virtualizer.measureElement}>
              <NoteKind_1 event={event} skipMetadata={false} />
            </div>
          );
        case 6:
          return (
            <div
              key={event.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <Repost key={event.id} event={event} />
            </div>
          );
        default:
          return (
            <div
              key={event.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <NoteKindUnsupport key={event.id} event={event} />
            </div>
          );
      }
    },
    [data]
  );

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
        ) : items.length === 0 ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-6">
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-sm font-medium text-white">
                  No new postrs about this hashtag in 24 hours ago
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            <div
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${items[0].start}px)`,
              }}
            >
              {items.map((item) => renderItem(item.index))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
