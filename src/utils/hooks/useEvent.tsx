import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';

import { parser } from '@utils/parser';
import { LumeEvent } from '@utils/types';

export function useEvent(id: string, embed?: string) {
  const { ndk } = useNDK();
  const { status, data, error, isFetching } = useQuery(
    ['note', id],
    async () => {
      if (embed) {
        const event: LumeEvent = JSON.parse(embed);
        if (event.kind === 1) embed['content'] = parser(event);
        return embed;
      } else {
        const event = (await ndk.fetchEvent(id)) as unknown as LumeEvent;
        if (!event) throw new Error('Event not found');
        if (event.kind === 1) event['content'] = parser(event);
        return event as unknown as LumeEvent;
      }
    },
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return { status, data, error, isFetching };
}
