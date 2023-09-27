import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { VList } from 'virtua';

import { useNDK } from '@libs/ndk/provider';

import {
  ArticleNote,
  FileNote,
  NoteSkeleton,
  NoteWrapper,
  Repost,
  TextNote,
  UnknownNote,
} from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { nHoursAgo } from '@utils/date';
import { Widget } from '@utils/types';

export function GlobalHashtagWidget({ params }: { params: Widget }) {
  const { ndk } = useNDK();
  const { status, data } = useQuery(
    [params.id + '-' + params.title],
    async () => {
      const events = await ndk.fetchEvents({
        kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Article],
        '#t': [params.content],
        since: nHoursAgo(24),
      });
      return [...events] as unknown as NDKEvent[];
    },
    { refetchOnWindowFocus: false }
  );

  // render event match event kind
  const renderItem = useCallback(
    (event: NDKEvent) => {
      switch (event.kind) {
        case NDKKind.Text:
          return (
            <NoteWrapper key={event.id} event={event}>
              <TextNote />
            </NoteWrapper>
          );
        case NDKKind.Repost:
          return <Repost key={event.id} event={event} />;
        case 1063:
          return (
            <NoteWrapper key={event.id} event={event}>
              <FileNote />
            </NoteWrapper>
          );
        case NDKKind.Article:
          return (
            <NoteWrapper key={event.id} event={event}>
              <ArticleNote />
            </NoteWrapper>
          );
        default:
          return (
            <NoteWrapper key={event.id} event={event}>
              <UnknownNote />
            </NoteWrapper>
          );
      }
    },
    [data]
  );

  return (
    <WidgetWrapper>
      <TitleBar id={params.id} title={params.title + ' in 24 hours ago'} />
      <div className="h-full">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
              <NoteSkeleton />
            </div>
          </div>
        ) : data.length === 0 ? (
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
            {data.map((item) => renderItem(item))}

            <div className="h-16" />
          </VList>
        )}
      </div>
    </WidgetWrapper>
  );
}
