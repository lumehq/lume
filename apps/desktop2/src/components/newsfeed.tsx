import { RepostNote } from "@/components/repost";
import { Suggest } from "@/components/suggest";
import { TextNote } from "@/components/text";
import { useArk } from "@lume/ark";
import { LoaderIcon, ArrowRightCircleIcon, InfoIcon } from "@lume/icons";
import { Event, Kind } from "@lume/types";
import { Column } from "@lume/ui";
import { FETCH_LIMIT } from "@lume/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { Virtualizer } from "virtua";

export function Newsfeed() {
  const ark = useArk();
  // @ts-ignore, just work!!!
  const { account } = useParams({ strict: false });
  const {
    data,
    hasNextPage,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["local_newsfeed", account],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const events = await ark.get_events(
        "local",
        FETCH_LIMIT,
        pageParam,
        true,
      );
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
    <Column.Root>
      <Column.Header title="Newsfeed" />
      <Column.Content>
        {isLoading || isRefetching ? (
          <div className="flex h-20 w-full flex-col items-center justify-center gap-1">
            <LoaderIcon className="size-5 animate-spin" />
          </div>
        ) : !data.length ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-neutral-50 p-5 dark:bg-neutral-950">
              <InfoIcon className="size-6" />
              <p>
                Empty newsfeed. Or you view the{" "}
                <Link
                  to="/$account/home"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Global Newsfeed
                </Link>
              </p>
            </div>
            <Suggest />
          </div>
        ) : (
          <Virtualizer overscan={3}>
            {data.map((item) => renderItem(item))}
          </Virtualizer>
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
      </Column.Content>
    </Column.Root>
  );
}
