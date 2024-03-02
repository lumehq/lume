import { RepostNote } from "@/components/repost";
import { Suggest } from "@/components/suggest";
import { TextNote } from "@/components/text";
import { useArk } from "@lume/ark";
import {
  LoaderIcon,
  ArrowRightCircleIcon,
  RefreshIcon,
  InfoIcon,
} from "@lume/icons";
import { Event, Kind } from "@lume/types";
import { EmptyFeed } from "@lume/ui";
import { FETCH_LIMIT } from "@lume/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/$account/home")({
  component: Home,
});

function Home() {
  const ark = useArk();
  const currentDate = new Date().toLocaleString("default", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const { account } = Route.useParams();
  const {
    data,
    hasNextPage,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
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
    <div className="flex flex-col gap-3">
      <div className="mx-auto flex h-12 w-full max-w-xl shrink-0 items-center justify-between border-b border-neutral-100 dark:border-neutral-900">
        <h3 className="text-sm font-medium uppercase leading-tight text-neutral-600 dark:text-neutral-400">
          {currentDate}
        </h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="text-neutral-700 hover:text-blue-500 dark:text-neutral-300"
          >
            <RefreshIcon className="size-4" />
          </button>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <div className="flex-1">
          {isLoading || isRefetching ? (
            <div className="flex h-20 w-full flex-col items-center justify-center gap-1">
              <LoaderIcon className="size-5 animate-spin" />
            </div>
          ) : !data.length ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
                <InfoIcon className="size-5" />
                <p>
                  Empty newsfeed. Or you can go to{" "}
                  <a href="" className="text-blue-500 hover:text-blue-600">
                    Discover
                  </a>
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
        </div>
      </div>
    </div>
  );
}
