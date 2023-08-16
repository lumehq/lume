import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useEffect, useRef } from 'react';

import { NoteKind_1, NoteKind_1063, NoteThread, Repost } from '@shared/notes';
import { NoteKindUnsupport } from '@shared/notes/kinds/unsupport';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';

import { LumeEvent, Widget } from '@utils/types';

export function FeedBlock({ params }: { params: Widget }) {
  const { status, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['newsfeed', params.content],
      queryFn: async () => {
        return { data: [], nextCursor: 0 };
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const notes = data ? data.pages.flatMap((d: { data: LumeEvent[] }) => d.data) : [];

  const parentRef = useRef();
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? notes.length + 1 : notes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 500,
    overscan: 2,
  });

  const itemsVirtualizer = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= notes.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [notes.length, fetchNextPage, rowVirtualizer.getVirtualItems()]);

  const renderItem = useCallback(
    (index: string | number) => {
      const note: LumeEvent = notes[index];
      if (!note) return;
      switch (note.kind) {
        case 1: {
          const root = note.tags.find((el) => el[3] === 'root')?.[1];
          const reply = note.tags.find((el) => el[3] === 'reply')?.[1];
          if (root || reply) {
            return (
              <div key={note.id} data-index={index} ref={rowVirtualizer.measureElement}>
                <NoteThread event={note} root={root} reply={reply} />
              </div>
            );
          } else {
            return (
              <div key={note.id} data-index={index} ref={rowVirtualizer.measureElement}>
                <NoteKind_1 event={note} skipMetadata={false} />
              </div>
            );
          }
        }
        case 6:
          return (
            <div key={note.id} data-index={index} ref={rowVirtualizer.measureElement}>
              <Repost key={note.id} event={note} />
            </div>
          );
        case 1063:
          return (
            <div key={note.id} data-index={index} ref={rowVirtualizer.measureElement}>
              <NoteKind_1063 key={note.id} event={note} />
            </div>
          );
        default:
          return (
            <div key={note.id} data-index={index} ref={rowVirtualizer.measureElement}>
              <NoteKindUnsupport key={note.id} event={note} />
            </div>
          );
      }
    },
    [notes]
  );

  return (
    <div className="relative w-[400px] shrink-0 bg-white/10">
      <TitleBar id={params.id} title={params.title} />
      <div ref={parentRef} className="scrollbar-hide h-full overflow-y-auto pb-20">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        ) : itemsVirtualizer.length === 0 ? (
          <div className="px-3 py-1.5">
            <div className="bbg-white/10 rounded-xl px-3 py-6">
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-sm text-white">
                  Not found any posts from last 48 hours
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
              {itemsVirtualizer.map((virtualRow) => renderItem(virtualRow.index))}
            </div>
          </div>
        )}
        {isFetchingNextPage && (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
