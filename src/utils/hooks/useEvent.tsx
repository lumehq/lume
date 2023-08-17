import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';

import { parser } from '@utils/parser';

export function useEvent(id: string, embed?: string) {
  const { ndk } = useNDK();
  const { status, data, error } = useQuery(
    ['event', id],
    async () => {
      if (embed) {
        const event: NDKEvent = JSON.parse(embed);
        // @ts-expect-error, #TODO: convert NDKEvent to ExNDKEvent
        if (event.kind === 1) event.content = parser(event);

        return event as unknown as NDKEvent;
      }

      const event = (await ndk.fetchEvent(id)) as NDKEvent;
      if (!event) throw new Error('event not found');
      // @ts-expect-error, #TODO: convert NDKEvent to ExNDKEvent
      if (event.kind === 1) event.content = parser(event);

      return event as NDKEvent;
    },
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return { status, data, error };
}
