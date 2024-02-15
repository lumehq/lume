import { useArk } from "@lume/ark";
import { ArrowRightCircleIcon, LoaderIcon, SearchIcon } from "@lume/icons";
import { Event, Kind } from "@lume/types";
import { EmptyFeed, TextNote } from "@lume/ui";
import { FETCH_LIMIT } from "@lume/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { CacheSnapshot, Virtualizer, VListHandle } from "virtua";

export const Route = createLazyFileRoute("/app/home")({
  component: Home,
});

function Home() {
  const ark = useArk();
  const ref = useRef<VListHandle>();
  const cacheKey = "timeline-vlist";

  const [offset, cache] = useMemo(() => {
    const serialized = sessionStorage.getItem(cacheKey);
    if (!serialized) return [];
    return JSON.parse(serialized) as [number, CacheSnapshot];
  }, []);

  const { data, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["timeline"],
      initialPageParam: 0,
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const events = await ark.get_text_events(FETCH_LIMIT, pageParam);
        return events;
      },
      getNextPageParam: (lastPage) => {
        const lastEvent = lastPage.at(-1);
        if (!lastEvent) return;
        return lastEvent.created_at;
      },
      select: (data) => data?.pages.flatMap((page) => page),
      refetchOnWindowFocus: false,
    });

  const renderItem = (event: Event) => {
    switch (event.kind) {
      case Kind.Text:
        return <TextNote key={event.id} event={event} />;
      default:
        return <TextNote key={event.id} event={event} />;
    }
  };

  useEffect(() => {
    if (!ref.current) return;
    const handle = ref.current;

    if (offset) {
      handle.scrollTo(offset);
    }

    return () => {
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify([handle.scrollOffset, handle.cache]),
      );
    };
  }, []);

  return (
    <div className="h-full w-full overflow-hidden rounded-xl bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-none dark:ring-1 dark:ring-white/5">
      <div className="h-full w-full overflow-y-auto pt-10">
        <div className="mx-auto w-full max-w-xl">
          {isLoading ? (
            <div className="flex h-20 w-full items-center justify-center">
              <LoaderIcon className="size-5 animate-spin" />
            </div>
          ) : !data.length ? (
            <div className="flex flex-col gap-3">
              <EmptyFeed />
              <a
                href="/suggest"
                className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 text-sm font-medium text-white hover:bg-blue-600"
              >
                <SearchIcon className="size-5" />
                Find accounts to follow
              </a>
            </div>
          ) : (
            <Virtualizer ref={ref} cache={cache} overscan={2}>
              {data.map((item) => renderItem(item))}
            </Virtualizer>
          )}
          <div className="flex h-16 items-center justify-center">
            {hasNextPage ? (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neutral-100 font-medium hover:bg-neutral-200 focus:outline-none dark:bg-neutral-900 dark:hover:bg-neutral-800"
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
