import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useRef } from 'react';

import { useNDK } from '@libs/ndk/provider';

import {
  ArticleNote,
  FileNote,
  NoteSkeleton,
  NoteWrapper,
  Repost,
  TextNote,
  UnknownNote,
} from '@shared/notes';
import { TitleBar } from '@shared/titleBar';

import { nHoursAgo } from '@utils/date';
import { Widget } from '@utils/types';

export function GlobalHashtagWidget({ params }: { params: Widget }) {
  const { ndk } = useNDK();
  const { status, data } = useQuery(
    [params.id + '-' + params.title],
    async () => {
      const events = await ndk.fetchEvents({
        kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Article],
        '#t': [params.content],
        since: nHoursAgo(24),
      });
      return [...events] as unknown as NDKEvent[];
    },
    { refetchOnWindowFocus: false }
  );

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
        case NDKKind.Text:
          return (
            <div
              key={event.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <NoteWrapper event={event}>
                <TextNote content={event.content} />
              </NoteWrapper>
            </div>
          );
        case NDKKind.Repost:
          return (
            <div
              key={event.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <Repost key={event.id} event={event} />
            </div>
          );
        case 1063:
          return (
            <div
              key={event.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <NoteWrapper event={event}>
                <FileNote event={event} />
              </NoteWrapper>
            </div>
          );
        case NDKKind.Article:
          return (
            <div
              key={event.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <NoteWrapper event={event}>
                <ArticleNote event={event} />
              </NoteWrapper>
            </div>
          );
        default:
          return (
            <div
              key={event.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <NoteWrapper event={event}>
                <UnknownNote event={event} />
              </NoteWrapper>
            </div>
          );
      }
    },
    [data]
  );

  return (
    <div className="relative shrink-0 grow-0 basis-[400px] bg-white/10 backdrop-blur-xl">
      <TitleBar id={params.id} title={params.title + ' in 24 hours ago'} />
      <div ref={parentRef} className="scrollbar-hide h-full overflow-y-auto pb-20">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
              <NoteSkeleton />
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-6 backdrop-blur-xl">
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-sm font-medium text-white">
                  There have been no new posts with this hashtag in the last 24 hours.
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
