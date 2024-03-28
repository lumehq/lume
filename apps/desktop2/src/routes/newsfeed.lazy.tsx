import { RepostNote } from "@/components/repost";
import { Suggest } from "@/components/suggest";
import { TextNote } from "@/components/text";
import { useEvents } from "@lume/ark";
import { LoaderIcon, ArrowRightCircleIcon, InfoIcon } from "@lume/icons";
import { Event, Kind } from "@lume/types";
import { Column } from "@lume/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/newsfeed")({
  component: Screen,
});

export function Screen() {
  // @ts-ignore, just work!!!
  const { id, name, account } = Route.useSearch();
  const { t } = useTranslation();
  const { data, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage } =
    useEvents("local", account);

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
      <Column.Header id={id} name={name} />
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
