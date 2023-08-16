import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { NostrEvent } from 'nostr-fetch';
import { useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

import { NoteKind_1, NoteKind_1063, NoteThread, Repost } from '@shared/notes';
import { NoteKindUnsupport } from '@shared/notes/kinds/unsupport';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';

import { useNostr } from '@utils/hooks/useNostr';
import { LumeEvent } from '@utils/types';

export function NetworkBlock() {
  const { fetchNotes } = useNostr();
  const { status, data, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['network-widget'],
    queryFn: async ({ pageParam = 24 }) => {
      return await fetchNotes(pageParam);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const parentRef = useRef();
  const notes = useMemo(
    // @ts-expect-error, todo
    () => (data ? data.pages.flatMap((d: { data: NostrEvent[] }) => d.data) : []),
    [data]
  );

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? notes.length + 1 : notes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 500,
    overscan: 2,
  });

  const itemsVirtualizer = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

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
                key={(root || reply) + note.id + index}
                data-index={index}
                ref={rowVirtualizer.measureElement}
              >
                <NoteThread event={note} root={root} reply={reply} />
              </div>
            );
          } else {
            return (
              <div
                key={note.id + index}
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
              key={note.id + index}
              data-index={index}
              ref={rowVirtualizer.measureElement}
            >
              <Repost key={note.id} event={note} />
            </div>
          );
        case 1063:
          return (
            <div
              key={note.id + index}
              data-index={index}
              ref={rowVirtualizer.measureElement}
            >
              <NoteKind_1063 key={note.id} event={note} />
            </div>
          );
        default:
          return (
            <div
              key={note.id + index}
              data-index={index}
              ref={rowVirtualizer.measureElement}
            >
              <NoteKindUnsupport key={note.id} event={note} />
            </div>
          );
      }
    },
    [notes]
  );

  return (
    <div className="relative w-[400px] shrink-0 bg-white/10">
      <TitleBar title="Network" />
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
                <p className="text-center text-sm text-white">
                  You not have any postrs to see yet
                  <br />
                  Follow more people to have more fun.
                </p>
                <Link
                  to="/trending"
                  className="inline-flex w-max rounded bg-fuchsia-500 px-2.5 py-1.5 text-sm hover:bg-fuchsia-600"
                >
                  Trending users
                </Link>
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
