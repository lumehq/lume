import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { NDKKind, type NDKSubscription } from "@nostr-dev-kit/ndk";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReplyForm } from "./editor/replyForm";
import { Reply } from "./note/primitives/reply";

export function ReplyList({
  eventId,
  className,
}: {
  eventId: string;
  className?: string;
}) {
  const ark = useArk();

  const [t] = useTranslation();
  const [data, setData] = useState<null | NDKEventWithReplies[]>(null);

  useEffect(() => {
    let sub: NDKSubscription = undefined;
    let isCancelled = false;

    async function fetchRepliesAndSub() {
      const id = ark.getCleanEventId(eventId);
      const events = await ark.getThreads(id);

      if (!isCancelled) {
        setData(events);
      }

      if (!sub) {
        sub = ark.subscribe({
          filter: {
            "#e": [id],
            kinds: [NDKKind.Text],
            since: Math.floor(Date.now() / 1000),
          },
          closeOnEose: false,
          cb: (event: NDKEventWithReplies) =>
            setData((prev) => [event, ...prev]),
        });
      }
    }

    // subscribe for new replies
    fetchRepliesAndSub();

    return () => {
      isCancelled = true;
      if (sub) sub.stop();
    };
  }, [eventId]);

  return (
    <div
      className={cn(
        "flex flex-col divide-y divide-neutral-100 dark:divide-neutral-900",
        className,
      )}
    >
      <ReplyForm
        eventId={eventId}
        className="border-t border-neutral-100 py-4 dark:border-neutral-900"
      />
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
