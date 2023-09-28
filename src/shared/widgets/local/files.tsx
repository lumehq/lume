import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { VList } from 'virtua';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';
import { FileNote, NoteSkeleton, NoteWrapper } from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { DBEvent, Widget } from '@utils/types';

export function LocalFilesWidget({ params }: { params: Widget }) {
  const { db } = useStorage();
  const { status, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [params.id + '-' + params.title],
      queryFn: async ({ pageParam = 0 }) => {
        return await db.getAllEventsByKinds([1063], 20, pageParam);
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
      return (
        <NoteWrapper key={event.id} event={event}>
          <FileNote />
        </NoteWrapper>
      );
    },
    [data]
  );

  return (
    <WidgetWrapper>
      <TitleBar id={params.id} title={params.title} />
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
