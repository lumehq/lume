import { TextNote } from "@/components/text";
import { RepostNote } from "@/components/repost";
import { useArk } from "@lume/ark";
import { ArrowRightCircleIcon, InfoIcon, LoaderIcon } from "@lume/icons";
import { Event, Kind } from "@lume/types";
import { FETCH_LIMIT } from "@lume/utils";
import { useInfiniteQuery } from "@tanstack/react-query";

export function EventList({ id }: { id: string }) {
  const ark = useArk();
  const { data, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["events", id],
      initialPageParam: 0,
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const events = await ark.get_events_from(id, FETCH_LIMIT, pageParam);
        return events;
      },
      getNextPageParam: (lastPage) => {
        const lastEvent = lastPage?.at(-1);
        if (!lastEvent) return;
        return lastEvent.created_at - 1;
      },
      select: (data) => data?.pages.flatMap((page) => page),
      refetchOnWindowFocus: false,
    });

  const renderItem = (event: Event) => {
    if (!event) return;
    switch (event.kind) {
      case Kind.Repost:
        return <RepostNote key={event.id} event={event} />;
      default:
        return <TextNote key={event.id} event={event} />;
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex h-20 w-full flex-col items-center justify-center gap-1">
          <LoaderIcon className="size-5 animate-spin" />
        </div>
      ) : !data.length ? (
        <div className="flex items-center gap-2 rounded-xl bg-neutral-50 p-5 dark:bg-neutral-950">
          <InfoIcon className="size-6" />
          <p>Empty newsfeed.</p>
        </div>
      ) : (
        data.map((item) => renderItem(item))
      )}
      <div className="flex h-20 items-center justify-center">
        {hasNextPage ? (
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="inline-flex h-12 w-36 items-center justify-center gap-2 rounded-full bg-neutral-100 px-3 font-medium hover:bg-neutral-200 focus:outline-none dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            {isFetchingNextPage ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <>
                <ArrowRightCircleIcon className="size-5" />
                Load more
              </>
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}
