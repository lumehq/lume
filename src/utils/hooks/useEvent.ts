import { NDKEvent, NostrEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useArk } from '@libs/ark';

export function useEvent(id: undefined | string, embed?: undefined | string) {
  const ark = useArk();
  const { status, isFetching, isError, data } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      // return embed event (nostr.band api)
      if (embed) {
        const embedEvent: NostrEvent = JSON.parse(embed);
        return new NDKEvent(ark.ndk, embedEvent);
      }

      // get event from relay
      const event = await ark.getEventById({ id });

      if (!event)
        throw new Error(`Cannot get event with ${id}, will be retry after 10 seconds`);

      return event;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 2,
  });

  return { status, isFetching, isError, data };
}
