import { RepostNote } from "@/components/repost";
import { Suggest } from "@/components/suggest";
import { TextNote } from "@/components/text";
import { LoaderIcon, InfoIcon } from "@lume/icons";
import { Event, Kind } from "@lume/types";
import { Column } from "@lume/ui";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Virtualizer } from "virtua";
import { fetch } from "@tauri-apps/plugin-http";

export const Route = createLazyFileRoute("/trending")({
  component: Screen,
});

export function Screen() {
  // @ts-ignore, just work!!!
  const { id, name, account } = Route.useSearch();
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["trending", account],
    queryFn: async () => {
      const res = await fetch("https://api.nostr.band/v0/trending/notes");
      const data = await res.json();
      const events = data.notes.map((item) => item.event) as Event[];
      return events.sort((a, b) => b.created_at - a.created_at);
    },
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
      <Column.Header id={id} name={name} />
      <Column.Content>
        {isLoading ? (
          <div className="flex h-20 w-full flex-col items-center justify-center gap-1">
            <button type="button" className="size-5" disabled>
              <LoaderIcon className="size-5 animate-spin" />
            </button>
          </div>
        ) : !data.length ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-neutral-50 p-5 dark:bg-neutral-950">
              <InfoIcon className="size-6" />
              <div>
                <p className="leading-tight">{t("emptyFeedTitle")}</p>
                <p className="leading-tight">{t("emptyFeedSubtitle")}</p>
              </div>
            </div>
            <Suggest />
          </div>
        ) : (
          <Virtualizer overscan={3}>
            {data.map((item) => renderItem(item))}
          </Virtualizer>
        )}
      </Column.Content>
    </Column.Root>
  );
}
