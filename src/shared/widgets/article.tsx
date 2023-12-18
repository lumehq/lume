import { NDKKind } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FetchFilter } from 'nostr-fetch';
import { useMemo } from 'react';
import { VList } from 'virtua';
import { Widget, useArk } from '@libs/ark';
import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';
import { MemoizedArticleNote } from '@shared/notes';
import { FETCH_LIMIT } from '@utils/constants';
import { WidgetProps } from '@utils/types';

export function ArticleWidget({ props }: { props: WidgetProps }) {
  const ark = useArk();

  const { status, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['article', props.id],
      initialPageParam: 0,
      queryFn: async ({
        signal,
        pageParam,
      }: {
        signal: AbortSignal;
        pageParam: number;
      }) => {
        let filter: FetchFilter;
        const content = JSON.parse(props.content);

        if (content.global) {
          filter = {
            kinds: [NDKKind.Article],
          };
        } else {
          filter = {
            kinds: [NDKKind.Article],
            authors: ark.account.contacts,
          };
        }

        const events = await ark.getInfiniteEvents({
          filter,
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

  return (
    <Widget.Root>
      <Widget.Header id={props.id} title={props.title} />
      <Widget.Content>
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
                    Oops, it looks like there are no articles.
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    You can close this widget
                  </p>
                </div>
              </div>
            </div>
          ) : (
            allEvents.map((item) => <MemoizedArticleNote key={item.id} event={item} />)
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
