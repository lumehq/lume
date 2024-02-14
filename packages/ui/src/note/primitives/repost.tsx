import { RepostIcon } from "@lume/icons";
import { Event } from "@lume/types";
import { cn } from "@lume/utils";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Note } from "..";
import { User } from "../../user";
import { useArk } from "@lume/ark";

export function RepostNote({
  event,
  className,
}: {
  event: Event;
  className?: string;
}) {
  const ark = useArk();

  const { t } = useTranslation();
  const {
    isLoading,
    isError,
    data: repostEvent,
  } = useQuery({
    queryKey: ["repost", event.id],
    queryFn: async () => {
      try {
        if (event.content.length > 50) {
          const embed = JSON.parse(event.content) as Event;
          return embed;
        }
        const id = event.tags.find((el) => el[0] === "e")[1];
        return await ark.get_event(id);
      } catch {
        throw new Error("Failed to get repost event");
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (isLoading) {
    return <div className="w-full px-3 pb-3">Loading...</div>;
  }

  if (isError || !repostEvent) {
    return (
      <Note.Root className={className}>
        <User.Provider pubkey={event.pubkey}>
          <User.Root className="flex h-14 gap-2 px-3">
            <div className="inline-flex w-10 shrink-0 items-center justify-center">
              <RepostIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="inline-flex items-center gap-2">
              <User.Avatar className="size-6 shrink-0 rounded object-cover" />
              <div className="inline-flex items-baseline gap-1">
                <User.Name className="font-medium text-neutral-900 dark:text-neutral-100" />
                <span className="text-blue-500">{t("note.reposted")}</span>
              </div>
            </div>
          </User.Root>
        </User.Provider>
        <div className="mb-3 select-text px-3">
          <div className="flex flex-col items-start justify-start rounded-lg bg-red-100 px-3 py-3 dark:bg-red-900">
            <p className="text-red-500">Failed to get event</p>
          </div>
        </div>
      </Note.Root>
    );
  }

  return (
    <Note.Root
      className={cn(
        "flex flex-col rounded-xl bg-neutral-50 dark:bg-neutral-950",
        className,
      )}
    >
      <User.Provider pubkey={event.pubkey}>
        <User.Root className="flex h-14 gap-2 px-3">
          <div className="inline-flex w-10 shrink-0 items-center justify-center">
            <RepostIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="inline-flex items-center gap-2">
            <User.Avatar className="size-6 shrink-0 rounded object-cover" />
            <div className="inline-flex items-baseline gap-1">
              <User.Name className="font-medium text-neutral-900 dark:text-neutral-100" />
              <span className="text-blue-500">{t("note.reposted")}</span>
            </div>
          </div>
        </User.Root>
      </User.Provider>
      <Note.Provider event={repostEvent}>
        <div className="relative flex flex-col gap-2 px-3">
          <div className="flex items-center justify-between">
            <Note.User className="flex-1 pr-2" />
            <Note.Menu />
          </div>
          <Note.Content />
          <div className="flex h-14 items-center justify-between">
            <Note.Pin />
            <div className="inline-flex items-center gap-4">
              <Note.Reply />
              <Note.Repost />
              <Note.Zap />
            </div>
          </div>
        </div>
      </Note.Provider>
    </Note.Root>
  );
}
