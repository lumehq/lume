import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EventWithReplies } from "@lume/types";

export function ReplyList({
  eventId,
  className,
}: {
  eventId: string;
  className?: string;
}) {
  const ark = useArk();

  const [t] = useTranslation();
  const [data, setData] = useState<null | EventWithReplies[]>(null);

  useEffect(() => {
    async function getReplies() {
      const events = await ark.get_event_thread(eventId);
      setData(events);
    }
    getReplies();
  }, [eventId]);

  return (
    <div
      className={cn(
        "flex flex-col divide-y divide-neutral-100 dark:divide-neutral-900",
        className,
      )}
    >
      {!data ? (
        <div className="mt-4 flex h-16 items-center justify-center p-3">
          <LoaderIcon className="h-5 w-5 animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="mt-4 flex w-full items-center justify-center">
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
