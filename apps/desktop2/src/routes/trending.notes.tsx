import { RepostNote } from "@/components/repost";
import { TextNote } from "@/components/text";
import { LoaderIcon } from "@lume/icons";
import { Event, Kind } from "@lume/types";
import { Await, createFileRoute } from "@tanstack/react-router";
import { Virtualizer } from "virtua";
import { fetch } from "@tauri-apps/plugin-http";
import { defer } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/trending/notes")({
  loader: async ({ abortController }) => {
    try {
      return {
        data: defer(
          fetch("https://api.nostr.band/v0/trending/notes", {
            signal: abortController.signal,
          })
            .then((res) => res.json())
            .then((res) => res.notes.map((item) => item.event) as Event[]),
        ),
      };
    } catch (e) {
      throw new Error(String(e));
    }
  },
  component: Screen,
});

export function Screen() {
  const { data } = Route.useLoaderData();

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
    <div className="w-full h-full">
      <Virtualizer overscan={3}>
        <Suspense
          fallback={
            <div className="flex h-20 w-full flex-col items-center justify-center gap-1">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium"
                disabled
              >
                <LoaderIcon className="size-5" />
                Loading...
              </button>
            </div>
          }
        >
          <Await promise={data}>
            {(notes) => notes.map((event) => renderItem(event))}
          </Await>
        </Suspense>
      </Virtualizer>
    </div>
  );
}
