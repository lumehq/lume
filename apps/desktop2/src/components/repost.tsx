import { RepostIcon } from "@lume/icons";
import { Event } from "@lume/types";
import { cn } from "@lume/utils";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Note, User } from "@lume/ui";
import { useRouteContext } from "@tanstack/react-router";

export function RepostNote({
  event,
  className,
}: {
  event: Event;
  className?: string;
}) {
  const { ark, settings } = useRouteContext({ strict: false });
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
          const embed: Event = JSON.parse(event.content);
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
  });

  if (isLoading) {
    return <div className="w-full px-3 pb-3">Loading...</div>;
  }

  if (isError || !repostEvent) {
    return (
      <Note.Root
        className={cn(
          "flex flex-col gap-2 border-b border-neutral-100 px-3 py-5 dark:border-neutral-900",
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
        "flex flex-col gap-2 border-b border-neutral-100 px-3 py-5 dark:border-neutral-900",
        className,
      )}
    >
      <User.Provider pubkey={event.pubkey}>
        <User.Root className="flex gap-3">
          <div className="inline-flex w-11 shrink-0 items-center justify-center">
            <RepostIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="inline-flex items-center gap-2">
            <User.Avatar className="size-6 shrink-0 rounded-full object-cover" />
            <div className="inline-flex items-baseline gap-1">
              <User.Name className="font-medium text-neutral-900 dark:text-neutral-100" />
              <span className="text-blue-500">{t("note.reposted")}</span>
            </div>
          </div>
        </User.Root>
      </User.Provider>
      <Note.Provider event={repostEvent}>
        <div className="flex flex-col gap-2">
          <Note.User />
          <div className="flex gap-3">
            <div className="size-11 shrink-0" />
            <div className="min-w-0 flex-1">
              <Note.Content />
              <div className="mt-4 flex items-center justify-between">
                <div className="-ml-1 inline-flex items-center gap-4">
                  <Note.Reply />
                  <Note.Repost />
                  <Note.Pin />
                  {settings.zap ? <Note.Zap /> : null}
                </div>
                <Note.Menu />
              </div>
            </div>
          </div>
        </div>
      </Note.Provider>
    </Note.Root>
  );
}
