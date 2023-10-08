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
import { EventLoader, WidgetWrapper } from '@shared/widgets';

import { useStronghold } from '@stores/stronghold';

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

  const isFetched = useStronghold((state) => state.isFetched);
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
    if (db.account && db.account.network && dbEvents.length > 0) {
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
  }, [data]);

  return (
    <WidgetWrapper>
      <TitleBar title="Network" />
      <div className="flex-1">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-zinc-100 px-3 py-3 backdrop-blur-xl dark:bg-zinc-900">
              <NoteSkeleton />
            </div>
          </div>
        ) : dbEvents.length === 0 ? (
          <EventLoader firstTime={true} />
        ) : (
          <VList className="scrollbar-hide h-full">
            {!isFetched ? <EventLoader firstTime={false} /> : null}
            {dbEvents.map((item) => renderItem(item))}
            <div className="flex items-center justify-center px-3 py-1.5">
              {dbEvents.length > 0 ? (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="inline-flex h-10 w-max items-center justify-center gap-2 rounded-full bg-interor-500 px-6 font-medium hover:bg-interor-600 focus:outline-none"
                >
                  {isFetchingNextPage ? (
                    <>
                      <span>Loading...</span>
                      <LoaderIcon className="h-5 w-5 animate-spin text-zinc-900 dark:text-zinc-100" />
                    </>
                  ) : hasNextPage ? (
                    <>
                      <ArrowRightCircleIcon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                      <span>Load more</span>
                    </>
                  ) : (
                    <>
                      <ArrowRightCircleIcon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
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
