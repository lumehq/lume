import { useInfiniteQuery } from "@tanstack/react-query";
import { commands } from "../commands";
import { dedupEvents } from "../dedup";
import { NostrEvent } from "@lume/types";

export function useInfiniteEvents(
  contacts: string[],
  label: string,
  account: string,
  nsfw?: boolean,
) {
  const pubkeys = contacts;
  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [label, account],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      try {
        const until: string = pageParam > 0 ? pageParam.toString() : undefined;
        const query = await commands.getLocalEvents(pubkeys, until);

        if (query.status === "ok") {
          const nostrEvents = query.data as unknown as NostrEvent[];
          const events = dedupEvents(nostrEvents, nsfw);

          return events;
        } else {
          throw new Error(query.error);
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    getNextPageParam: (lastPage) => lastPage?.at(-1)?.created_at - 1,
    select: (data) => data?.pages.flatMap((page) => page),
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
}
