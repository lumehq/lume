import { useEvent } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { Note, User } from "@lume/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import { WindowVirtualizer } from "virtua";
import { ReplyList } from "./-components/replyList";

export const Route = createLazyFileRoute("/events/$eventId")({
  component: Event,
});

function Event() {
  const { eventId } = Route.useParams();
  const { isLoading, isError, data } = useEvent(eventId);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderIcon className="size-5 animate-spin" />
      </div>
    );
  }

  if (isError) {
    <div className="flex h-full w-full items-center justify-center">
      <p>Not found.</p>
    </div>;
  }

  return (
    <WindowVirtualizer>
      <div className="flex h-screen w-screen flex-col bg-gradient-to-tr from-neutral-200 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <div data-tauri-drag-region className="h-11 w-full shrink-0" />
        <div className="flex h-full min-h-0 w-full">
          <div className="h-full w-full flex-1 px-2 pb-2">
            <div className="h-full w-full overflow-hidden overflow-y-auto rounded-xl bg-white px-3 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-none dark:ring-1 dark:ring-white/5">
              <Note.Provider event={data}>
                <Note.Root className="flex flex-col">
                  <div className="mb-2 flex items-center justify-between pt-4">
                    <User.Provider pubkey={data.pubkey}>
                      <User.Root className="flex flex-1 items-center gap-3">
                        <User.Avatar className="size-11 shrink-0 rounded-full object-cover ring-1 ring-neutral-200/50 dark:ring-neutral-800/50" />
                        <div className="flex flex-1 flex-col">
                          <User.Name className="font-semibold text-neutral-900 dark:text-neutral-100" />
                          <div className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <User.Time time={data.created_at} />
                            <span>·</span>
                            <User.NIP05 />
                          </div>
                        </div>
                      </User.Root>
                    </User.Provider>
                    <Note.Menu />
                  </div>
                  <Note.Thread className="mb-2" />
                  <Note.Content className="min-w-0" />
                  <div className="flex h-14 items-center justify-between">
                    <Note.Reaction />
                    <div className="inline-flex items-center gap-4">
                      <Note.Repost />
                      <Note.Zap />
                    </div>
                  </div>
                </Note.Root>
              </Note.Provider>
              {data ? <ReplyList eventId={eventId} /> : null}
            </div>
          </div>
        </div>
      </div>
    </WindowVirtualizer>
  );
}
