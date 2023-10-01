import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { VList } from 'virtua';

import { useNDK } from '@libs/ndk/provider';

import {
  ArticleNote,
  FileNote,
  NoteWrapper,
  Repost,
  TextNote,
  UnknownNote,
} from '@shared/notes';

export function RelayEventList({ relayUrl }: { relayUrl: string }) {
  const { fetcher } = useNDK();
  const { status, data } = useQuery(
    ['relay-event'],
    async () => {
      const url = 'wss://' + relayUrl;
      const events = await fetcher.fetchLatestEvents(
        [url],
        {
          kinds: [NDKKind.Text, NDKKind.Repost, 1063, NDKKind.Article],
        },
        100
      );
      return events as unknown as NDKEvent[];
    },
    { refetchOnWindowFocus: false }
  );

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
    <div className="h-full">
      <div className="mx-auto w-full max-w-[500px]">
        {status === 'loading' ? (
          <div>Loading...</div>
        ) : (
          <VList className="scrollbar-hide h-full">
            <div className="h-10" />
            {data.map((item) => renderItem(item))}
            <div className="h-16" />
          </VList>
        )}
      </div>
    </div>
  );
}
