import { Event } from "@lume/types";
import { Note } from "@lume/ui";
import { cn } from "@lume/utils";

export function TextNote({
  event,
  className,
}: {
  event: Event;
  className?: string;
}) {
  return (
    <Note.Provider event={event}>
      <Note.Root
        className={cn(
          "mb-5 flex flex-col gap-2 border-b border-neutral-100 pb-5 dark:border-neutral-900",
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
                <Note.Zap />
              </div>
              <Note.Menu />
            </div>
          </div>
        </div>
      </Note.Root>
    </Note.Provider>
  );
}
