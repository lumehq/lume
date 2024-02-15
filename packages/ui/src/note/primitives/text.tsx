import { Event } from "@lume/types";
import { cn } from "@lume/utils";
import { Note } from "..";

export function TextNote({
  event,
  className,
}: {
  event: Event;
  className?: string;
}) {
  return (
    <Note.Provider event={event}>
      <Note.Root className={cn("flex flex-col", className)}>
        <div className="flex h-14 items-center justify-between px-3">
          <Note.User className="flex-1 pr-2" />
          <Note.Menu />
        </div>
        <div className="flex gap-3">
          <div className="size-10 shrink-0" />
          <div className="flex-1">
            <Note.Thread className="mb-2" />
            <Note.Content className="min-w-0 px-3" />
            <div className="flex h-14 items-center justify-between px-3">
              <Note.Pin />
              <div className="inline-flex items-center gap-4">
                <Note.Reply />
                <Note.Repost />
                <Note.Zap />
              </div>
            </div>
          </div>
        </div>
      </Note.Root>
    </Note.Provider>
  );
}
