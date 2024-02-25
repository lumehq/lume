import { useArk } from "@lume/ark";
import {
  ArrowRightCircleIcon,
  ArrowRightIcon,
  LoaderIcon,
  SearchIcon,
} from "@lume/icons";
import { Event, Kind } from "@lume/types";
import { EmptyFeed } from "@lume/ui";
import { FETCH_LIMIT } from "@lume/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Virtualizer } from "virtua";
import { TextNote } from "./-components/text";
import { RepostNote } from "./-components/repost";

export const Route = createLazyFileRoute("/$account/home/local")({
  component: LocalTimeline,
});

function LocalTimeline() {
  const ark = useArk();

  const { account } = Route.useParams();
  const { data, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
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
    <div>
      {isLoading ? (
        <div className="flex h-20 w-full flex-col items-center justify-center gap-1">
          <LoaderIcon className="size-5 animate-spin" />
          <p>Loading...</p>
        </div>
      ) : !data.length ? (
        <div className="flex flex-col gap-3">
          <EmptyFeed />
          <a
            href="/suggest"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 font-medium text-white hover:bg-blue-600"
          >
            Find accounts to follow
            <ArrowRightIcon className="size-5" />
          </a>
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
    </div>
  );
}
