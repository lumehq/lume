import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useNewsfeed } from '@app/space/hooks/useNewsfeed';

import { getNotes } from '@libs/storage';

import { NoteKind_1, NoteKind_1063, NoteThread, Repost } from '@shared/notes';
import { NoteKindUnsupport } from '@shared/notes/kinds/unsupport';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';

import { useNote } from '@stores/note';

import { LumeEvent } from '@utils/types';

const ITEM_PER_PAGE = 10;

export function FollowingBlock() {
  // subscribe for live update
  useNewsfeed();
  // notify user that new note is arrive
  const [hasNewNote, toggleHasNewNote] = useNote((state) => [
    state.hasNewNote,
    state.toggleHasNewNote,
  ]);

  const { status, data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ['newsfeed-circle'],
      queryFn: async ({ pageParam = 0 }) => {
        return await getNotes(ITEM_PER_PAGE, pageParam);
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

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= notes.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [notes.length, fetchNextPage, rowVirtualizer.getVirtualItems()]);

  const refreshFirstPage = () => {
    // refetch
    refetch({ refetchPage: (_, index: number) => index === 0 });
    // scroll to top
    rowVirtualizer.scrollToIndex(1);
    // stop notify
    toggleHasNewNote(false);
  };

  const renderItem = useCallback(
    (index: string | number) => {
      const note: LumeEvent = notes[index];
      if (!note) return;
      switch (note.kind) {
        case 1: {
          let root: string;
          let reply: string;
          if (note.tags?.[0]?.[0] === 'e' && !note.tags?.[0]?.[3]) {
            root = note.tags[0][1];
          } else {
            root = note.tags.find((el) => el[3] === 'root')?.[1];
            reply = note.tags.find((el) => el[3] === 'reply')?.[1];
          }
          if (root || reply) {
            return (
              <div
                key={note.event_id || note.id}
                data-index={index}
                ref={rowVirtualizer.measureElement}
              >
                <NoteThread event={note} root={root} reply={reply} />
              </div>
            );
          } else {
            return (
              <div
                key={note.event_id || note.id}
                data-index={index}
                ref={rowVirtualizer.measureElement}
              >
                <NoteKind_1 event={note} skipMetadata={false} />
              </div>
            );
          }
        }
        case 6:
          return (
            <div
              key={note.event_id || note.id}
              data-index={index}
              ref={rowVirtualizer.measureElement}
            >
              <Repost key={note.event_id} event={note} />
            </div>
          );
        case 1063:
          return (
            <div
              key={note.event_id || note.id}
              data-index={index}
              ref={rowVirtualizer.measureElement}
            >
              <NoteKind_1063 key={note.event_id} event={note} />
            </div>
          );
        default:
          return (
            <div
              key={note.event_id || note.id}
              data-index={index}
              ref={rowVirtualizer.measureElement}
            >
              <NoteKindUnsupport key={note.event_id} event={note} />
            </div>
          );
      }
    },
    [notes]
  );

  return (
    <div className="relative w-[400px] shrink-0 border-r border-zinc-900">
      <TitleBar title="Your Circle" />
      {hasNewNote && (
        <div className="absolute left-1/2 top-12 z-50 -translate-x-1/2 transform">
          <button
            type="button"
            onClick={() => refreshFirstPage()}
            className="inline-flex w-min items-center justify-center rounded-full border border-fuchsia-800/50 bg-fuchsia-500 px-3.5 py-1.5 text-sm hover:bg-fuchsia-600"
          >
            Newest
          </button>
        </div>
      )}
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
                  You not have any posts to see yet
                  <br />
                  Follow more people to have more fun.
                </p>
                <Link
                  to="/app/trending"
                  className="inline-flex w-max rounded bg-fuchsia-500 px-2.5 py-1.5 text-sm hover:bg-fuchsia-600"
                >
                  Trending
                </Link>
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
              {itemsVirtualizer.map((virtualRow) => renderItem(virtualRow.index))}
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
