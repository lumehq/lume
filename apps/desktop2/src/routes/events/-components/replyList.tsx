import type { EventWithReplies } from "@lume/types";
import { Spinner } from "@lume/ui";
import { cn } from "@lume/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Reply } from "./reply";
import { LumeEvent } from "@lume/system";

export function ReplyList({
  eventId,
  className,
}: {
  eventId: string;
  className?: string;
}) {
  const [t] = useTranslation();
  const [data, setData] = useState<null | EventWithReplies[]>(null);

  useEffect(() => {
    async function getReplies() {
      const events = await LumeEvent.getReplies(eventId);
      setData(events);
    }
    getReplies();
  }, [eventId]);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="h-11 flex px-3 items-center text-sm font-semibold text-neutral-700 dark:text-neutral-300 border-t border-neutral-100 dark:border-neutral-900">
        Replies ({data?.length ?? 0})
      </div>
      {!data ? (
        <div className="flex h-16 items-center justify-center p-3">
          <Spinner className="size-5" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 py-6">
            <h3 className="text-3xl">👋</h3>
            <p className="leading-none text-neutral-600 dark:text-neutral-400">
              {t("note.reply.empty")}
            </p>
          </div>
        </div>
      ) : (
        data.map((event) => <Reply key={event.id} event={event} />)
      )}
    </div>
  );
}
