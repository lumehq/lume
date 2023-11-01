import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { VList } from 'virtua';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';
import { FileNote, NoteWrapper } from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { FETCH_LIMIT } from '@stores/constants';

import { Widget } from '@utils/types';

export function LocalFilesWidget({ params }: { params: Widget }) {
  const { db } = useStorage();
  const { ndk, relayUrls, fetcher } = useNDK();
  const { status, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['local-files'],
      initialPageParam: 0,
      queryFn: async ({
        signal,
        pageParam,
      }: {
        signal: AbortSignal;
        pageParam: number;
      }) => {
        const events = await fetcher.fetchLatestEvents(
          relayUrls,
          {
            kinds: [1063],
            authors: db.account.circles,
          },
          FETCH_LIMIT,
          { asOf: pageParam === 0 ? undefined : pageParam, abortSignal: signal }
        );

        const ndkEvents = events.map((event) => {
          return new NDKEvent(ndk, event);
        });

        return ndkEvents.sort((a, b) => b.created_at - a.created_at);
      },
      getNextPageParam: (lastPage) => {
        const lastEvent = lastPage.at(-1);
        if (!lastEvent) return;
        return lastEvent.created_at - 1;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const allEvents = useMemo(
    () => (data ? data.pages.flatMap((page) => page) : []),
    [data]
  );

  return (
    <WidgetWrapper>
      <TitleBar id={params.id} title={params.title} />
      <VList className="flex-1">
        {status === 'pending' ? (
          <div className="flex h-full w-full items-center justify-center">
            <LoaderIcon className="h-5 w-5 animate-spin" />
          </div>
        ) : allEvents.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center px-3">
            <div className="flex flex-col items-center gap-4">
              <img src="/ghost.png" alt="empty feeds" className="h-16 w-16" />
              <div className="text-center">
                <h3 className="font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
                  Oops, it looks like there are no files.
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  You can close this widget
                </p>
              </div>
            </div>
          </div>
        ) : (
          allEvents.map((item) => (
            <NoteWrapper key={item.id} event={item}>
              <FileNote />
            </NoteWrapper>
          ))
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
