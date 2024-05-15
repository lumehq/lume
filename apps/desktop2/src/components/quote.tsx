import { QuoteIcon } from "@lume/icons";
import type { Event } from "@lume/types";
import { Note } from "@/components/note";
import { cn } from "@lume/utils";

export function Quote({
  event,
  className,
}: {
  event: Event;
  className?: string;
}) {
  const quoteEventId = event.tags.find(
    (tag) => tag[0] === "q" || tag[3] === "mention",
  )?.[1];

  return (
    <Note.Provider event={event}>
      <Note.Root
        className={cn(
          "bg-white dark:bg-black/20 backdrop-blur-lg rounded-xl flex flex-col gap-3 shadow-primary dark:ring-1 ring-neutral-800/50",
          className,
        )}
      >
        <div className="flex flex-col gap-3">
          <Note.Child eventId={quoteEventId} isRoot />
          <div className="flex items-center gap-2 px-3">
            <div className="inline-flex items-center gap-1.5 shrink-0 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <QuoteIcon className="size-4" />
              Quote
            </div>
            <div className="flex-1 h-px bg-neutral-100 dark:bg-white/5" />
          </div>
          <div>
            <div className="px-3 h-14 flex items-center justify-between">
              <Note.User />
            </div>
            <Note.Content className="px-3" quote={false} clean />
          </div>
        </div>
        <div className="flex items-center h-14 px-3">
          <Note.Open />
        </div>
      </Note.Root>
    </Note.Provider>
  );
}
