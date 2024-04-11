import { Suggest } from "@/components/suggest";
import {
  LoaderIcon,
  ArrowRightCircleIcon,
  InfoIcon,
  RepostIcon,
} from "@lume/icons";
import { ColumnRouteSearch, Event, Kind } from "@lume/types";
import { Column, Note, User } from "@lume/ui";
import { cn } from "@lume/utils";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Virtualizer } from "virtua";

export const Route = createFileRoute("/newsfeed")({
  validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
    return {
      account: search.account,
      label: search.label,
      name: search.name,
    };
  },
  beforeLoad: async ({ context }) => {
    const ark = context.ark;
    const settings = await ark.get_settings();

    return { settings };
  },
  component: Screen,
});

export function Screen() {
  const { label, name, account } = Route.useSearch();
  const { ark } = Route.useRouteContext();
  const { t } = useTranslation();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [name, account],
      initialPageParam: 0,
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const events = await ark.get_events(20, pageParam);
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

function TextNote({ event, className }: { event: Event; className?: string }) {
  const { settings } = Route.useRouteContext();

  return (
    <Note.Provider event={event}>
      <Note.Root
        className={cn(
          "flex flex-col gap-2 border-b border-neutral-100 px-3 py-5 dark:border-neutral-900",
          className,
        )}
      >
        <Note.User />
        <div className="flex gap-3">
          <div className="size-11 shrink-0" />
          <div className="min-w-0 flex-1">
            <Note.Content className="mb-2" />
            <Note.Thread />
            <div className="mt-4 flex items-center justify-between">
              <div className="-ml-1 inline-flex items-center gap-4">
                <Note.Reply />
                <Note.Repost />
                {settings.zap ? <Note.Zap /> : null}
              </div>
              <Note.Menu />
            </div>
          </div>
        </div>
      </Note.Root>
    </Note.Provider>
  );
}

function RepostNote({
  event,
  className,
}: {
  event: Event;
  className?: string;
}) {
  const { ark, settings } = Route.useRouteContext();
  const { t } = useTranslation();
  const {
    isLoading,
    isError,
    data: repostEvent,
  } = useQuery({
    queryKey: ["repost", event.id],
    queryFn: async () => {
      try {
        if (event.content.length > 50) {
          const embed: Event = JSON.parse(event.content);
          return embed;
        }
        const id = event.tags.find((el) => el[0] === "e")[1];
        return await ark.get_event(id);
      } catch {
        throw new Error("Failed to get repost event");
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (isLoading) {
    return <div className="w-full px-3 pb-3">Loading...</div>;
  }

  if (isError || !repostEvent) {
    return (
      <Note.Root
        className={cn(
          "flex flex-col gap-2 border-b border-neutral-100 px-3 py-5 dark:border-neutral-900",
          className,
        )}
      >
        <User.Provider pubkey={event.pubkey}>
          <User.Root className="flex h-14 gap-2 px-3">
            <div className="inline-flex w-10 shrink-0 items-center justify-center">
              <RepostIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="inline-flex items-center gap-2">
              <User.Avatar className="size-6 shrink-0 rounded object-cover" />
              <div className="inline-flex items-baseline gap-1">
                <User.Name className="font-medium text-neutral-900 dark:text-neutral-100" />
                <span className="text-blue-500">{t("note.reposted")}</span>
              </div>
            </div>
          </User.Root>
        </User.Provider>
        <div className="mb-3 select-text px-3">
          <div className="flex flex-col items-start justify-start rounded-lg bg-red-100 px-3 py-3 dark:bg-red-900">
            <p className="text-red-500">Failed to get event</p>
          </div>
        </div>
      </Note.Root>
    );
  }

  return (
    <Note.Root
      className={cn(
        "flex flex-col gap-2 border-b border-neutral-100 px-3 py-5 dark:border-neutral-900",
        className,
      )}
    >
      <User.Provider pubkey={event.pubkey}>
        <User.Root className="flex gap-3">
          <div className="inline-flex w-11 shrink-0 items-center justify-center">
            <RepostIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="inline-flex items-center gap-2">
            <User.Avatar className="size-6 shrink-0 rounded-full object-cover" />
            <div className="inline-flex items-baseline gap-1">
              <User.Name className="font-medium text-neutral-900 dark:text-neutral-100" />
              <span className="text-blue-500">{t("note.reposted")}</span>
            </div>
          </div>
        </User.Root>
      </User.Provider>
      <Note.Provider event={repostEvent}>
        <div className="flex flex-col gap-2">
          <Note.User />
          <div className="flex gap-3">
            <div className="size-11 shrink-0" />
            <div className="min-w-0 flex-1">
              <Note.Content />
              <div className="mt-4 flex items-center justify-between">
                <div className="-ml-1 inline-flex items-center gap-4">
                  <Note.Reply />
                  <Note.Repost />
                  {settings.zap ? <Note.Zap /> : null}
                </div>
                <Note.Menu />
              </div>
            </div>
          </div>
        </div>
      </Note.Provider>
    </Note.Root>
  );
}
