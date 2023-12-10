import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { WVList } from 'virtua';

import { useArk } from '@libs/ark';

import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';
import {
  MemoizedRepost,
  MemoizedTextNote,
  NoteSkeleton,
  UnknownNote,
} from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { UserProfile, WidgetWrapper } from '@shared/widgets';

import { FETCH_LIMIT } from '@utils/constants';
import { Widget } from '@utils/types';

export function UserWidget({ widget }: { widget: Widget }) {
  const { ark } = useArk();
  const { status, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['user-posts', widget.content],
      initialPageParam: 0,
      queryFn: async ({
        signal,
        pageParam,
      }: {
        signal: AbortSignal;
        pageParam: number;
      }) => {
        const events = await ark.getInfiniteEvents({
          filter: {
            kinds: [NDKKind.Text, NDKKind.Repost],
            authors: [widget.content],
          },
          limit: FETCH_LIMIT,
          pageParam,
          signal,
        });

        return events;
      },
      getNextPageParam: (lastPage) => {
        const lastEvent = lastPage.at(-1);
        if (!lastEvent) return;
        return lastEvent.created_at - 1;
      },
      refetchOnWindowFocus: false,
    });

  const allEvents = useMemo(
    () => (data ? data.pages.flatMap((page) => page) : []),
    [data]
  );

  // render event match event kind
  const renderItem = useCallback(
    (event: NDKEvent) => {
      switch (event.kind) {
        case NDKKind.Text:
          return <MemoizedTextNote key={event.id} event={event} />;
        case NDKKind.Repost:
          return <MemoizedRepost key={event.id} event={event} />;
        default:
          return <UnknownNote key={event.id} event={event} />;
      }
    },
    [data]
  );

  return (
    <WidgetWrapper>
      <TitleBar id={widget.id} title={widget.title} />
      <WVList className="flex-1 overflow-y-auto">
        <div className="px-3 pt-1.5">
          <UserProfile pubkey={widget.content} />
        </div>
        <div>
          <h3 className="mb-3 mt-4 px-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Latest posts
          </h3>
          <div className="flex h-full w-full flex-col justify-between gap-1.5 pb-10">
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
          </div>
        </div>
      </WVList>
    </WidgetWrapper>
  );
}
