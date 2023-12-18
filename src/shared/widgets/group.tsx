import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { VList } from 'virtua';
import { Widget, useArk } from '@libs/ark';
import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';
import {
  MemoizedRepost,
  MemoizedTextNote,
  NoteSkeleton,
  UnknownNote,
} from '@shared/notes';
import { FETCH_LIMIT } from '@utils/constants';
import { WidgetProps } from '@utils/types';

export function GroupWidget({ props }: { props: WidgetProps }) {
  const ark = useArk();
  const { status, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['groupfeeds', props.id],
      initialPageParam: 0,
      queryFn: async ({
        signal,
        pageParam,
      }: {
        signal: AbortSignal;
        pageParam: number;
      }) => {
        const authors = JSON.parse(props.content);
        const events = await ark.getInfiniteEvents({
          filter: {
            kinds: [NDKKind.Text, NDKKind.Repost],
            authors: authors,
          },
          limit: FETCH_LIMIT,
          pageParam,
          signal,
          dedup: false,
        });

        return events;
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

  const renderItem = (event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Text:
        return <MemoizedTextNote key={event.id} event={event} />;
      case NDKKind.Repost:
        return <MemoizedRepost key={event.id} event={event} />;
      default:
        return <UnknownNote key={event.id} event={event} />;
    }
  };

  return (
    <Widget.Root>
      <Widget.Header id={props.id} title={props.title} />
      <Widget.Content>
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
      </Widget.Content>
    </Widget.Root>
  );
}
