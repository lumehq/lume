import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { VList } from 'virtua';

import { useNDK } from '@libs/ndk/provider';

import { LoaderIcon } from '@shared/icons';
import { ArticleNote, NoteWrapper } from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { Widget } from '@utils/types';

export function GlobalArticlesWidget({ params }: { params: Widget }) {
  const { ndk } = useNDK();
  const { status, data } = useQuery(
    ['global-articles'],
    async () => {
      const events = await ndk.fetchEvents({
        kinds: [NDKKind.Article],
        limit: 200,
      });
      const sortedEvents = [...events].sort((x, y) => y.created_at - x.created_at);
      return sortedEvents;
    },
    { refetchOnWindowFocus: false }
  );

  // render event match event kind
  const renderItem = useCallback(
    (event: NDKEvent) => {
      return (
        <NoteWrapper key={event.id} event={event}>
          <ArticleNote />
        </NoteWrapper>
      );
    },
    [data]
  );

  return (
    <WidgetWrapper>
      <TitleBar id={params.id} title={params.title} />
      <div className="flex-1">
        {status === 'loading' ? (
          <div className="flex h-full w-full items-center justify-center ">
            <div className="inline-flex flex-col items-center justify-center gap-2">
              <LoaderIcon className="h-5 w-5 animate-spin text-white" />
              <p className="text-sm font-medium text-white/80">Loading article...</p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center px-3">
            <div className="flex flex-col items-center gap-4">
              <img src="/ghost.png" alt="empty feeds" className="h-16 w-16" />
              <div className="text-center">
                <h3 className="font-semibold leading-tight">
                  Oops, it looks like there are no articles.
                </h3>
                <p className="text-white/50">You can close this widget</p>
              </div>
            </div>
          </div>
        ) : (
          <VList className="scrollbar-hide h-full">
            {data.map((item) => renderItem(item))}
            <div className="h-16" />
          </VList>
        )}
      </div>
    </WidgetWrapper>
  );
}
