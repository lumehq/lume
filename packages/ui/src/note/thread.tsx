import { cn } from "@lume/utils";
import { useTranslation } from "react-i18next";
import { Note } from ".";
import { useNoteContext } from "./provider";
import { useArk } from "@lume/ark";

export function NoteThread({ className }: { className?: string }) {
  const ark = useArk();
  const event = useNoteContext();
  const thread = ark.parse_event_thread({
    content: event.content,
    tags: event.tags,
  });

  const { t } = useTranslation();

  if (!thread) return null;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex h-min w-full flex-col gap-3 rounded-xl bg-neutral-100 p-3 ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/5">
        {thread.rootEventId ? (
          <Note.Child eventId={thread.rootEventId} isRoot />
        ) : null}
        {thread.replyEventId ? (
          <Note.Child eventId={thread.replyEventId} />
        ) : null}
        <div className="inline-flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              ark.open_thread(thread.rootEventId || thread.rootEventId)
            }
            className="self-start text-blue-500 hover:text-blue-600"
          >
            {t("note.showThread")}
          </button>
        </div>
      </div>
    </div>
  );
}
