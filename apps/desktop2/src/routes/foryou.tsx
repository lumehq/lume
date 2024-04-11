import { RepostNote } from "@/components/repost";
import { Suggest } from "@/components/suggest";
import { TextNote } from "@/components/text";
import { LoaderIcon, ArrowRightCircleIcon, InfoIcon } from "@lume/icons";
import { ColumnRouteSearch, Event, Kind } from "@lume/types";
import { Column } from "@lume/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Virtualizer } from "virtua";

export const Route = createFileRoute("/foryou")({
  validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
    return {
      account: search.account,
      label: search.label,
      name: search.name,
    };
  },
  beforeLoad: async ({ search, context }) => {
    const ark = context.ark;
    const interests = await ark.get_interest();

    if (!interests) {
      throw redirect({
        to: "/interests",
        search: {
          ...search,
          redirect: "/foryou",
        },
      });
    }

    return {
      interests,
    };
  },
  component: Screen,
});

export function Screen() {
  const { label, name, account } = Route.useSearch();
  const { ark, interests } = Route.useRouteContext();
  const { t } = useTranslation();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [name, account],
      initialPageParam: 0,
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const events = await ark.get_events_from_interests(
          interests.hashtags,
          20,
          pageParam,
          true,
        );
        return events;
      },
      getNextPageParam: (lastPage) => {
        const lastEvent = lastPage?.at(-1);
        return lastEvent ? lastEvent.created_at - 1 : null;
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
      <Column.Header label={label} name={name} />
      <Column.Content>
        {isLoading ? (
          <div className="flex h-20 w-full flex-col items-center justify-center gap-1">
            <button type="button" className="size-5" disabled>
              <LoaderIcon className="size-5 animate-spin" />
            </button>
          </div>
        ) : !data.length ? (
          <div className="flex flex-col gap-3 p-3">
            <div className="flex items-center gap-2 rounded-xl bg-neutral-100 p-5 dark:bg-neutral-900">
              <InfoIcon className="size-6" />
              <div>
                <p className="font-medium leading-tight">
                  {t("global.emptyFeedTitle")}
                </p>
                <p className="leading-tight text-neutral-700 dark:text-neutral-300">
                  {t("global.emptyFeedSubtitle")}
                </p>
              </div>
            </div>
            <Suggest />
          </div>
        ) : (
          <Virtualizer overscan={3}>
            {data.map((item) => renderItem(item))}
          </Virtualizer>
        )}

        {data?.length && hasNextPage ? (
          <div className="flex h-20 items-center justify-center">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage || isFetchingNextPage}
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
          </div>
        ) : null}
      </Column.Content>
    </Column.Root>
  );
}
