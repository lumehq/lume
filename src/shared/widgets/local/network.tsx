import { NDKEvent, NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { VList } from 'virtua';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, ArrowRightIcon, LoaderIcon } from '@shared/icons';
import {
  MemoizedArticleNote,
  MemoizedFileNote,
  MemoizedRepost,
  MemoizedTextNote,
  NoteWrapper,
  UnknownNote,
} from '@shared/notes';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';
import { EventLoader, WidgetWrapper } from '@shared/widgets';

import { WidgetKinds, useWidgets } from '@stores/widgets';

import { useNostr } from '@utils/hooks/useNostr';
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

  const setWidget = useWidgets((state) => state.setWidget);
  const isFetched = useWidgets((state) => state.isFetched);
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
              <MemoizedTextNote />
            </NoteWrapper>
          );
        case NDKKind.Repost:
          return <MemoizedRepost key={dbEvent.id} event={event} />;
        case 1063:
          return (
            <NoteWrapper key={dbEvent.id} event={event}>
              <MemoizedFileNote />
            </NoteWrapper>
          );
        case NDKKind.Article:
          return (
            <NoteWrapper key={dbEvent.id} event={event}>
              <MemoizedArticleNote />
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

  const openTrendingWidgets = async () => {
    setWidget(db, {
      kind: WidgetKinds.nostrBand.trendingAccounts,
      title: 'Trending Accounts',
      content: '',
    });
  };

  // subscribe for new event
  // sub will be managed by lru-cache
  useEffect(() => {
    if (db.account && db.account.circles.length > 0 && dbEvents.length > 0) {
      const filter: NDKFilter = {
        kinds: [NDKKind.Text, NDKKind.Repost],
        authors: db.account.circles,
        since: Math.floor(Date.now() / 1000),
      };

      sub(filter, async (event) => {
        await db.createEvent(event);
      });
    }
  }, [data]);

  if (db.account.circles.length < 1) {
    return (
      <WidgetWrapper>
        <div className="flex h-full w-full items-center justify-center">
          <div className="px-8 text-center">
            <p className="mb-2 text-3xl">👋</p>
            <h1 className="text-lg font-semibold">You have not follow anyone yet</h1>
            <h5 className="text-sm text-neutral-600 dark:text-neutral-400">
              If you are new to Nostr, you can click button below to open trending users
              and start follow some of theme
            </h5>
            <button
              type="button"
              onClick={() => openTrendingWidgets()}
              className="mt-4 inline-flex h-9 w-max items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 font-semibold text-white hover:bg-blue-600"
            >
              Open trending
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper>
      <TitleBar id="9999" />
      <div className="flex-1">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-neutral-100 px-3 py-3 dark:bg-neutral-900">
              <NoteSkeleton />
            </div>
          </div>
        ) : dbEvents.length === 0 ? (
          <EventLoader firstTime={true} />
        ) : (
          <VList className="h-full scrollbar-none">
            {!isFetched ? <EventLoader firstTime={false} /> : null}
            {dbEvents.map((item) => renderItem(item))}
            <div className="flex items-center justify-center px-3 py-1.5">
              {dbEvents.length > 0 ? (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="inline-flex h-10 w-max items-center justify-center gap-2 rounded-full bg-blue-500 px-6 font-medium text-white hover:bg-blue-600 focus:outline-none"
                >
                  {isFetchingNextPage ? (
                    <>
                      <span>Loading...</span>
                      <LoaderIcon className="h-5 w-5 animate-spin" />
                    </>
                  ) : hasNextPage ? (
                    <>
                      <ArrowRightCircleIcon className="h-5 w-5" />
                      <span>Load more</span>
                    </>
                  ) : (
                    <>
                      <ArrowRightCircleIcon className="h-5 w-5" />
                      <span>Nothing more to load</span>
                    </>
                  )}
                </button>
              ) : null}
            </div>
            <div className="h-14" />
          </VList>
        )}
      </div>
    </WidgetWrapper>
  );
}
