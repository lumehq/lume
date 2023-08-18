import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';

import { parser } from '@utils/parser';
import { RichContent } from '@utils/types';

export function useEvent(id: string, embed?: string) {
  const { ndk } = useNDK();
  const { status, data, error } = useQuery(
    ['event', id],
    async () => {
      if (embed) {
        const event: NDKEvent = JSON.parse(embed);
        let richContent: RichContent;
        if (event.kind === 1) richContent = parser(event);

        return { event: event as NDKEvent, richContent: richContent };
      }

      const event = (await ndk.fetchEvent(id)) as NDKEvent;
      if (!event) throw new Error('event not found');
      let richContent: RichContent;
      if (event.kind === 1) richContent = parser(event);

      return { event: event as NDKEvent, richContent: richContent };
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
