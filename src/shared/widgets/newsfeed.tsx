import { NDKEvent, NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { VList } from 'virtua';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';
import {
  MemoizedArticleNote,
  MemoizedFileNote,
  MemoizedRepost,
  MemoizedTextNote,
  NoteSkeleton,
  NoteWrapper,
  UnknownNote,
} from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { useNostr } from '@utils/hooks/useNostr';

export function NewsfeedWidget() {
  const queryClient = useQueryClient();

  const { db } = useStorage();
  const { sub } = useNostr();
  const { relayUrls, ndk, fetcher } = useNDK();
  const { status, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['newsfeed'],
      initialPageParam: 0,
      queryFn: async ({
        signal,
        pageParam,
      }: {
        signal: AbortSignal;
        pageParam: number;
      }) => {
        const rootIds = new Set();
        const dedupQueue = new Set();

        const events = await fetcher.fetchLatestEvents(
          relayUrls,
          {
            kinds: [NDKKind.Text, NDKKind.Repost, 1063, NDKKind.Article],
            authors: db.account.circles,
          },
          50,
          { asOf: pageParam === 0 ? undefined : pageParam, abortSignal: signal }
        );

        const ndkEvents = events.map((event) => {
          return new NDKEvent(ndk, event);
        });

        ndkEvents.forEach((event) => {
          const tags = event.tags.filter((el) => el[0] === 'e');
          if (tags && tags.length > 0) {
            const rootId = tags.filter((el) => el[3] === 'root')[1] ?? tags[0][1];
            if (rootIds.has(rootId)) return dedupQueue.add(event.id);
            rootIds.add(rootId);
          }
        });

        return ndkEvents
          .filter((event) => !dedupQueue.has(event.id))
          .sort((a, b) => b.created_at - a.created_at);
      },
      getNextPageParam: (lastPage) => {
        const lastEvent = lastPage.at(-1);
        if (!lastEvent) return;
        return lastEvent.created_at - 1;
      },
    });

  const allEvents = useMemo(
    () => (data ? data.pages.flatMap((page) => page) : []),
    [data]
  );

  const renderItem = useCallback((event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Text:
        return (
          <NoteWrapper key={event.id} event={event}>
            <MemoizedTextNote />
          </NoteWrapper>
        );
      case NDKKind.Repost:
        return <MemoizedRepost key={event.id} event={event} />;
      case 1063:
        return (
          <NoteWrapper key={event.id} event={event}>
            <MemoizedFileNote />
          </NoteWrapper>
        );
      case NDKKind.Article:
        return (
          <NoteWrapper key={event.id} event={event}>
            <MemoizedArticleNote />
          </NoteWrapper>
        );
      default:
        return (
          <NoteWrapper key={event.id} event={event}>
            <UnknownNote />
          </NoteWrapper>
        );
    }
  }, []);

  useEffect(() => {
    if (status === 'success' && db.account && db.account.circles.length > 0) {
      queryClient.fetchQuery({ queryKey: ['notification'] });

      const filter: NDKFilter = {
        kinds: [NDKKind.Text, NDKKind.Repost],
        authors: db.account.circles,
        since: Math.floor(Date.now() / 1000),
      };

      sub(
        filter,
        async (event) => {
          queryClient.setQueryData(
            ['newsfeed'],
            (prev: { pageParams: number; pages: Array<NDKEvent[]> }) => ({
              ...prev,
              pages: [[event], ...prev.pages],
            })
          );
        },
        false,
        'newsfeed'
      );
    }
  }, [status]);

  return (
    <WidgetWrapper>
      <TitleBar id="9999" isLive />
      <VList className="flex-1">
        {status === 'pending' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-neutral-100 px-3 py-3 dark:bg-neutral-900">
              <NoteSkeleton />
            </div>
          </div>
        ) : (
          allEvents.map((item) => renderItem(item))
        )}
        <div className="flex h-16 items-center justify-center px-3 pb-3">
          {hasNextPage ? (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className="inline-flex h-10 w-max items-center justify-center gap-2 rounded-full bg-blue-500 px-6 font-medium text-white hover:bg-blue-600 focus:outline-none"
            >
              {isFetchingNextPage ? (
                <LoaderIcon className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ArrowRightCircleIcon className="h-5 w-5" />
                  Load more
                </>
              )}
            </button>
          ) : null}
        </div>
      </VList>
    </WidgetWrapper>
  );
}
