import { useTranslation } from "react-i18next";
import { User } from "../../user";
import { useEvent } from "@lume/ark";
import { LinkIcon } from "@lume/icons";
import { useRouteContext } from "@tanstack/react-router";

export function MentionNote({
  eventId,
  openable = true,
}: {
  eventId: string;
  openable?: boolean;
}) {
  const { ark } = useRouteContext({ strict: false });
  const { t } = useTranslation();
  const { isLoading, isError, data } = useEvent(eventId);

  if (isLoading) {
    return (
      <div
        contentEditable={false}
        className="my-1 flex w-full cursor-default items-center justify-between rounded-xl border border-black/10 p-3 dark:border-white/10"
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        contentEditable={false}
        className="my-1 w-full cursor-default rounded-xl border border-black/10 p-3 dark:border-white/10"
      >
        {t("note.error")}
      </div>
    );
  }

  return (
    <div className="my-1 flex w-full cursor-default flex-col rounded-xl border border-black/10 px-3 pt-1 dark:border-white/10">
      <User.Provider pubkey={data.pubkey}>
        <User.Root className="flex h-10 items-center gap-2">
          <User.Avatar className="size-6 shrink-0 rounded-full object-cover" />
          <div className="inline-flex flex-1 items-center gap-2">
            <User.Name className="font-semibold text-neutral-900 dark:text-neutral-100" />
            <span className="text-neutral-600 dark:text-neutral-400">·</span>
            <User.Time
              time={data.created_at}
              className="text-neutral-600 dark:text-neutral-400"
            />
          </div>
        </User.Root>
      </User.Provider>
      <div className="line-clamp-3 select-text whitespace-normal text-balance leading-normal">
        {data.content}
      </div>
      {openable ? (
        <div className="flex h-10 items-center justify-between">
          <button
            type="button"
            onClick={() => ark.open_thread(data.id)}
            className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-blue-500 dark:text-neutral-400"
          >
            {t("note.showMore")}
            <LinkIcon className="size-4" />
          </button>
        </div>
      ) : (
        <div className="h-3" />
      )}
    </div>
  );
}
