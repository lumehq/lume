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
import { UserProfile } from '@shared/userProfile';
import { WidgetWrapper } from '@shared/widgets';

import { nHoursAgo } from '@utils/date';
import { Widget } from '@utils/types';

export function LocalUserWidget({ params }: { params: Widget }) {
  const { ndk } = useNDK();
  const { status, data } = useQuery(
    [params.id + '-' + params.title],
    async () => {
      const events = await ndk.fetchEvents({
        kinds: [1, 6],
        authors: [params.content],
        since: nHoursAgo(24),
      });
      return [...events] as unknown as NDKEvent[];
    },
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
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
      <TitleBar id={params.id} title={params.title} />
      <div className="scrollbar-hide h-full overflow-y-auto pb-20">
        <div className="px-3 pt-1.5">
          <UserProfile pubkey={params.content} />
        </div>
        <div>
          <h3 className="mt-4 px-3 text-lg font-semibold text-white">Latest posts</h3>
          <div className="flex h-full w-full flex-col justify-between gap-1.5 pb-10">
            {status === 'loading' ? (
              <div className="px-3 py-1.5">
                <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
                  <NoteSkeleton />
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="px-3 py-1.5">
                <div className="rounded-xl bg-white/10 px-3 py-6 backdrop-blur-xl">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-center text-sm text-white">
                      No new post from user in 24 hours ago
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
        </div>
      </div>
    </WidgetWrapper>
  );
}
