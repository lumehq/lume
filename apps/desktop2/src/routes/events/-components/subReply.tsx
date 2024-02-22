import { Event } from "@lume/types";
import { Note } from "@lume/ui";

export function SubReply({ event }: { event: Event; rootEventId?: string }) {
  return (
    <Note.Provider event={event}>
      <Note.Root className="py-2">
        <div className="flex h-14 items-center justify-between">
          <Note.User className="flex-1 pr-2" />
          <Note.Menu />
        </div>
        <Note.Content />
        <div className="mt-2 flex items-center justify-end gap-4">
          <Note.Repost />
          <Note.Zap />
        </div>
      </Note.Root>
    </Note.Provider>
  );
}
