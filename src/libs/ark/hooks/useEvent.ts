import { useQuery } from '@tanstack/react-query';
import { useArk } from '@libs/ark';

export function useEvent(id: string) {
  const ark = useArk();
  const { status, isLoading, isError, data } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
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

  return { status, isLoading, isError, data };
}
