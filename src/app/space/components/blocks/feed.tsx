import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { getNotesByAuthors, removeBlock } from '@libs/storage';

import { Note } from '@shared/notes/note';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';

const ITEM_PER_PAGE = 10;

export function FeedBlock({ params }: { params: any }) {
  const queryClient = useQueryClient();
  const { status, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['newsfeed', params.content],
      queryFn: async ({ pageParam = 0 }) => {
        return await getNotesByAuthors(params.content, ITEM_PER_PAGE, pageParam);
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const notes = data ? data.pages.flatMap((d: { data: any }) => d.data) : [];
  const parentRef = useRef();

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? notes.length + 1 : notes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 500,
    overscan: 2,
  });

  const itemsVirtualizer = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= notes.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [notes.length, fetchNextPage, rowVirtualizer.getVirtualItems()]);

  const block = useMutation({
    mutationFn: (id: string) => {
      return removeBlock(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
    },
  });

  const renderItem = (index: string | number) => {
    const note = notes[index];

    if (!note) return;
    return (
      <div key={index} data-index={index} ref={rowVirtualizer.measureElement}>
        <Note event={note} />
      </div>
    );
  };

  return (
    <div className="w-[400px] shrink-0 border-r border-zinc-900">
      <TitleBar title={params.title} onClick={() => block.mutate(params.id)} />
      <div
        ref={parentRef}
        className="scrollbar-hide flex h-full w-full flex-col justify-between gap-1.5 overflow-y-auto pb-20 pt-1.5"
        style={{ contain: 'strict' }}
      >
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        ) : itemsVirtualizer.length === 0 ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 py-6">
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-sm text-zinc-300">
                  Not found any posts from last 48 hours
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
              {rowVirtualizer
                .getVirtualItems()
                .map((virtualRow) => renderItem(virtualRow.index))}
            </div>
          </div>
        )}
        {isFetchingNextPage && (
          <div className="px-3 py-1.5">
            <div className="rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
