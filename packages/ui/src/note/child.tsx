import { useTranslation } from "react-i18next";
import { User } from "../user";
import { useEvent } from "@lume/ark";

export function NoteChild({
  eventId,
  isRoot,
}: {
  eventId: string;
  isRoot?: boolean;
}) {
  const { t } = useTranslation();
  const { isLoading, isError, data } = useEvent(eventId);

  if (isLoading) {
    return (
      <div className="relative flex gap-3">
        <div className="relative flex-1 rounded-xl bg-neutral-100 p-3 text-sm dark:bg-neutral-900">
          Loading...
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="relative flex gap-3">
        <div className="relative flex-1 rounded-xl bg-neutral-100 p-3 text-sm dark:bg-neutral-900">
          {t("note.error")}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex gap-3">
      <div className="relative flex-1 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
        <div className="absolute right-0 top-[18px] h-3 w-3 -translate-y-1/2 translate-x-1/2 rotate-45 transform bg-neutral-100 dark:bg-neutral-900" />
        <div className="content-break mt-6 line-clamp-3 select-text leading-normal text-neutral-900 dark:text-neutral-100">
          {data.content}
        </div>
      </div>
      <User.Provider pubkey={data.pubkey}>
        <User.Root>
          <User.Avatar className="size-10 shrink-0 rounded-full object-cover" />
          <div className="absolute left-3 top-3">
            <User.Name className="inline font-semibold" />{" "}
            <span className="inline font-normal text-neutral-700 dark:text-neutral-300">
              {isRoot ? t("note.posted") : t("note.replied")}:
            </span>
          </div>
        </User.Root>
      </User.Provider>
    </div>
  );
}
