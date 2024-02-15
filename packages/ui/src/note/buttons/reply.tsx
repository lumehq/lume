import { ReplyIcon } from "@lume/icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useTranslation } from "react-i18next";
import { useNoteContext } from "../provider";

export function NoteReply() {
  const event = useNoteContext();
  const { t } = useTranslation();

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            className="group inline-flex h-7 w-7 items-center justify-center text-neutral-800 dark:text-neutral-200"
          >
            <ReplyIcon className="size-5 group-hover:text-blue-500" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-neutral-50 will-change-[transform,opacity] dark:bg-neutral-50 dark:text-neutral-950">
            {t("note.menu.viewThread")}
            <Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
