import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { normalizeRelayUrl } from 'nostr-fetch';
import { useCallback } from 'react';
import { VList } from 'virtua';

import { useNDK } from '@libs/ndk/provider';

import { LoaderIcon } from '@shared/icons';
import { MemoizedRepost, MemoizedTextNote, UnknownNote } from '@shared/notes';

export function RelayEventList({ relayUrl }: { relayUrl: string }) {
  const { fetcher } = useNDK();
  const { status, data } = useQuery({
    queryKey: ['relay-events', relayUrl],
    queryFn: async () => {
      const url = 'wss://' + relayUrl;
      const events = await fetcher.fetchLatestEvents(
        [normalizeRelayUrl(url)],
        {
          kinds: [NDKKind.Text, NDKKind.Repost],
        },
        20
      );
      return events as unknown as NDKEvent[];
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

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
    <VList className="mx-auto h-full w-full max-w-[500px] pt-10 scrollbar-none">
      {status === 'pending' ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="inline-flex flex-col items-center justify-center gap-2">
            <LoaderIcon className="h-5 w-5 animate-spin text-white" />
            <p className="text-sm font-medium text-white/80">Loading newsfeed...</p>
          </div>
        </div>
      ) : (
        data.map((item) => renderItem(item))
      )}
      <div className="h-20" />
    </VList>
  );
}
