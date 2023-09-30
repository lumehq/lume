import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';

export function RelayEventList({ relayUrl }: { relayUrl: string }) {
  const { fetcher } = useNDK();
  const { status, data } = useQuery(
    ['relay-event'],
    async () => {
      const events = await fetcher.fetchLatestEvents(
        [relayUrl],
        {
          kinds: [NDKKind.Text, NDKKind.Repost, 1063, NDKKind.Article],
        },
        100
      );

      return events as unknown as NDKEvent[];
    },
    { refetchOnWindowFocus: false }
  );

  return (
    <div>
      <p>TODO</p>
    </div>
  );
}
