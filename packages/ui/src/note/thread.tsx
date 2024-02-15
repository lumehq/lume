import { PinIcon } from "@lume/icons";
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
    <div className={cn("w-full px-3", className)}>
      <div className="flex h-min w-full flex-col gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
        {thread.rootEventId ? (
          <Note.Child eventId={thread.rootEventId} isRoot />
        ) : null}
        {thread.replyEventId ? (
          <Note.Child eventId={thread.replyEventId} />
        ) : null}
        <div className="inline-flex items-center justify-between">
          <a
            href={`/events/${thread?.rootEventId || thread?.replyEventId}`}
            className="self-start text-blue-500 hover:text-blue-600"
          >
            {t("note.showThread")}
          </a>
          <button
            type="button"
            className="inline-flex size-6 items-center justify-center rounded-md bg-neutral-200 text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
          >
            <PinIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
