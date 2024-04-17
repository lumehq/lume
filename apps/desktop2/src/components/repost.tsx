import { RepostIcon } from "@lume/icons";
import { Event } from "@lume/types";
import { cn } from "@lume/utils";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Note, Spinner, User } from "@lume/ui";
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
        const id = event.tags.find((el) => el[0] === "e")?.[1];
        if (id) return await ark.get_event(id);
      } catch (e) {
        throw new Error(e);
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

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
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div className="w-full h-16 flex items-center px-3 border border-neutral-100 dark:border-neutral-900">
          <p>Event not found</p>
        </div>
      ) : (
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
      )}
    </Note.Root>
  );
}
