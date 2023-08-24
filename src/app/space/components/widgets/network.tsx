import { NDKEvent, NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { destr } from 'destr';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';
import {
  ArticleNote,
  FileNote,
  NoteWrapper,
  Repost,
  TextNote,
  UnknownNote,
} from '@shared/notes';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';

import { useNostr } from '@utils/hooks/useNostr';
import { DBEvent } from '@utils/types';

export function NetworkWidget() {
  const { sub } = useNostr();
  const { db } = useStorage();
  const { status, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['network-widget'],
      queryFn: async ({ pageParam = 0 }) => {
        return await db.getAllEvents(30, pageParam);
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    });

  const dbEvents = useMemo(
    () => (data ? data.pages.flatMap((d: { data: DBEvent[] }) => d.data) : []),
    [data]
  );
  const parentRef = useRef<HTMLDivElement>();
  const virtualizer = useVirtualizer({
    count: hasNextPage ? dbEvents.length : dbEvents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 650,
    overscan: 4,
  });
  const items = virtualizer.getVirtualItems();

  // render event match event kind
  const renderItem = useCallback(
    (index: string | number) => {
      const dbEvent: DBEvent = dbEvents[index];
      if (!dbEvent) return;

      const event: NDKEvent = JSON.parse(dbEvent.event as string);
      switch (event.kind) {
        case NDKKind.Text:
          return (
            <div
              key={dbEvent.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <NoteWrapper event={event} root={dbEvent.root_id} reply={dbEvent.reply_id}>
                <TextNote event={event} />
              </NoteWrapper>
            </div>
          );
        case NDKKind.Repost:
          return (
            <div
              key={dbEvent.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <Repost key={dbEvent.id} event={event} />
            </div>
          );
        case 1063:
          return (
            <div
              key={dbEvent.id + index}
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
              key={dbEvent.id + index}
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
              key={dbEvent.id + index}
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
    [dbEvents]
  );

  // subscribe for new event
  // sub will be managed by lru-cache
  useEffect(() => {
    if (db.account && db.account.network) {
      const filter: NDKFilter = {
        kinds: [1, 6],
        authors: db.account.network,
        since: db.account.last_login_at ?? Math.floor(Date.now() / 1000),
      };

      sub(filter, async (event) => {
        let root: string;
        let reply: string;
        if (event.tags?.[0]?.[0] === 'e' && !event.tags?.[0]?.[3]) {
          root = event.tags[0][1];
        } else {
          root = event.tags.find((el) => el[3] === 'root')?.[1];
          reply = event.tags.find((el) => el[3] === 'reply')?.[1];
        }
        await db.createEvent(
          event.id,
          destr(event),
          event.pubkey,
          event.kind,
          root,
          reply,
          event.created_at
        );
      });
    }
  }, []);

  return (
    <div className="relative shrink-0 grow-0 basis-[400px] bg-white/10">
      <TitleBar title="Network" />
      <div ref={parentRef} className="scrollbar-hide h-full overflow-y-auto pb-20">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        ) : dbEvents.length === 0 ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-6">
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-sm text-white">
                  You not have any postrs to see yet
                  <br />
                  Follow more people to have more fun.
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
        {isFetchingNextPage && (
          <div className="mb-20 px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        )}
        <div className="px-3 py-1.5">
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none"
          >
            {isFetchingNextPage ? (
              <>
                <span className="w-5" />
                <span>Loading...</span>
                <LoaderIcon className="h-5 w-5 animate-spin text-white" />
              </>
            ) : hasNextPage ? (
              <>
                <span className="w-5" />
                <span>Load more</span>
                <ArrowRightCircleIcon className="h-5 w-5" />
              </>
            ) : (
              <>
                <span className="w-5" />
                <span>Nothing more to load</span>
                <ArrowRightCircleIcon className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
