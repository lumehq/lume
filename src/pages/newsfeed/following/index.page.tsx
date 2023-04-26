import FormBase from '@components/form/base';
import NewsfeedLayout from '@components/layouts/newsfeed';
import { NoteBase } from '@components/note/base';
import { Placeholder } from '@components/note/placeholder';
import { NoteQuoteRepost } from '@components/note/quoteRepost';

import { hasNewerNoteAtom } from '@stores/note';

import { countTotalNotes, getNotes } from '@utils/storage';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowUp } from 'iconoir-react';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';

const ITEM_PER_PAGE = 20;
const TIME = Math.floor(Date.now() / 1000);

let totalNotes = 0;

if (typeof window !== 'undefined') {
  const result = await countTotalNotes();
  totalNotes = result.total;
}

export function Page() {
  const [hasNewerNote] = useAtom(hasNewerNoteAtom);

  const { status, error, data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage }: any = useInfiniteQuery({
    queryKey: ['following'],
    queryFn: async ({ pageParam = 0 }) => {
      return await getNotes(TIME, ITEM_PER_PAGE, pageParam);
    },
    getNextPageParam: (lastPage) => (lastPage.nextCursor <= totalNotes ? lastPage.nextCursor : 'undefined'),
  });

  const allRows = data ? data.pages.flatMap((d: { data: any }) => d.data) : [];
  const parentRef = useRef();

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400,
    overscan: 5,
  });

  const itemsVirtualizer = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= allRows.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNextPage, allRows.length, rowVirtualizer.getVirtualItems()]);

  return (
    <NewsfeedLayout>
      <div className="relative h-full w-full rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
        {hasNewerNote && (
          <div className="absolute left-1/2 top-2 z-50 -translate-x-1/2 transform">
            <button className="inline-flex h-8 transform items-center justify-center gap-1 rounded-full bg-fuchsia-500 pl-3 pr-3.5 text-sm shadow-md shadow-fuchsia-800/20 active:translate-y-1">
              <ArrowUp width={14} height={14} />
              Load latest
            </button>
          </div>
        )}
        {status === 'loading' ? (
          <Placeholder />
        ) : status === 'error' ? (
          <div>{error.message}</div>
        ) : (
          <div ref={parentRef} className="h-full w-full overflow-y-auto" style={{ contain: 'strict' }}>
            <FormBase />
            <div
              className="relative w-full"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              <div
                className="absolute left-0 top-0 w-full"
                style={{
                  transform: `translateY(${itemsVirtualizer[0].start - rowVirtualizer.options.scrollMargin}px)`,
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const note = allRows[virtualRow.index];
                  if (note) {
                    if (note.kind === 1) {
                      return (
                        <div key={virtualRow.index} data-index={virtualRow.index} ref={rowVirtualizer.measureElement}>
                          <NoteBase key={note.event_id} event={note} />
                        </div>
                      );
                    } else {
                      return (
                        <div key={virtualRow.index} data-index={virtualRow.index} ref={rowVirtualizer.measureElement}>
                          <NoteQuoteRepost key={note.event_id} event={note} />
                        </div>
                      );
                    }
                  }
                })}
              </div>
            </div>
          </div>
        )}
        <div>{isFetching && !isFetchingNextPage ? 'Background Updating...' : null}</div>
      </div>
    </NewsfeedLayout>
  );
}
