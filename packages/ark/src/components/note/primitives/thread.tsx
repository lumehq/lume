import { Note } from "..";
import { useEvent } from "../../../hooks/useEvent";
import { User } from "../../user";

export function ThreadNote({ eventId }: { eventId: string }) {
  const { isLoading, isError, data } = useEvent(eventId);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Note.Provider event={data}>
      <Note.Root className="flex flex-col rounded-xl bg-neutral-50 dark:bg-neutral-950">
        <div className="flex items-center justify-between px-3 h-16">
          <User.Provider pubkey={data.pubkey}>
            <User.Root className="flex h-16 items-center gap-3 flex-1">
              <User.Avatar className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-neutral-200/50 dark:ring-neutral-800/50" />
              <div className="flex flex-1 flex-col">
                <User.Name className="font-semibold text-neutral-900 dark:text-neutral-100" />
                <div className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <User.Time time={data.created_at} />
                  <span>·</span>
                  <User.NIP05 pubkey={data.pubkey} />
                </div>
              </div>
            </User.Root>
          </User.Provider>
          <Note.Menu />
        </div>
        <Note.Thread className="mb-2" />
        <Note.Content className="min-w-0 px-3" />
        <div className="flex items-center justify-between px-3 h-14">
          <Note.Pin />
          <div className="inline-flex items-center gap-4">
            <Note.Repost />
            <Note.Zap />
          </div>
        </div>
      </Note.Root>
    </Note.Provider>
  );
}
