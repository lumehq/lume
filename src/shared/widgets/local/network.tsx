import { NDKEvent, NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { VList } from 'virtua';

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
import { WidgetWrapper } from '@shared/widgets';

import { useNostr } from '@utils/hooks/useNostr';
import { toRawEvent } from '@utils/rawEvent';
import { DBEvent } from '@utils/types';

export function LocalNetworkWidget() {
  const { sub } = useNostr();
  const { db } = useStorage();
  const { status, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['local-network-widget'],
      queryFn: async ({ pageParam = 0 }) => {
        return await db.getAllEvents(20, pageParam);
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const dbEvents = useMemo(
    () => (data ? data.pages.flatMap((d: { data: DBEvent[] }) => d.data) : []),
    [data]
  );

  // render event match event kind
  const renderItem = useCallback(
    (dbEvent: DBEvent) => {
      const event: NDKEvent = JSON.parse(dbEvent.event as string);
      switch (event.kind) {
        case NDKKind.Text:
          return (
            <NoteWrapper
              key={dbEvent.id + dbEvent.root_id + dbEvent.reply_id}
              event={event}
              root={dbEvent.root_id}
              reply={dbEvent.reply_id}
            >
              <TextNote />
            </NoteWrapper>
          );
        case NDKKind.Repost:
          return <Repost key={dbEvent.id} event={event} />;
        case 1063:
          return (
            <NoteWrapper key={dbEvent.id} event={event}>
              <FileNote />
            </NoteWrapper>
          );
        case NDKKind.Article:
          return (
            <NoteWrapper key={dbEvent.id} event={event}>
              <ArticleNote />
            </NoteWrapper>
          );
        default:
          return (
            <NoteWrapper key={dbEvent.id} event={event}>
              <UnknownNote />
            </NoteWrapper>
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
        kinds: [NDKKind.Text, NDKKind.Repost],
        authors: db.account.network,
        since: Math.floor(Date.now() / 1000),
      };

      sub(filter, async (event) => {
        const rawEvent = toRawEvent(event);
        await db.createEvent(rawEvent);
      });
    }
  }, []);

  return (
    <WidgetWrapper>
      <TitleBar title="👋 Network" />
      <div className="h-full">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
              <NoteSkeleton />
            </div>
          </div>
        ) : dbEvents.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center px-3">
            <div className="flex flex-col items-center gap-4">
              <img src="/ghost.png" alt="empty feeds" className="h-16 w-16" />
              <div className="text-center">
                <h3 className="text-xl font-semibold leading-tight">
                  Your newsfeed is empty
                </h3>
                <p className="text-center text-white/50">
                  Connect more people to explore more content
                </p>
              </div>
            </div>
          </div>
        ) : (
          <VList className="scrollbar-hide h-full">
            {dbEvents.map((item) => renderItem(item))}
            <div className="flex items-center justify-center px-3 py-1.5">
              {dbEvents.length > 0 ? (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="inline-flex h-10 w-max items-center justify-center gap-2 rounded-full bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none"
                >
                  {isFetchingNextPage ? (
                    <>
                      <span>Loading...</span>
                      <LoaderIcon className="h-5 w-5 animate-spin text-white" />
                    </>
                  ) : hasNextPage ? (
                    <>
                      <ArrowRightCircleIcon className="h-5 w-5 text-white" />
                      <span>Load more</span>
                    </>
                  ) : (
                    <>
                      <ArrowRightCircleIcon className="h-5 w-5 text-white" />
                      <span>Nothing more to load</span>
                    </>
                  )}
                </button>
              ) : null}
            </div>
            <div className="h-16" />
          </VList>
        )}
      </div>
    </WidgetWrapper>
  );
}
