import { Event } from "@lume/types";
import { Note } from "@lume/ui";
import { cn } from "@lume/utils";
import { useRouteContext } from "@tanstack/react-router";

export function TextNote({
  event,
  className,
}: {
  event: Event;
  className?: string;
}) {
  const { settings } = useRouteContext({ strict: false });

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
