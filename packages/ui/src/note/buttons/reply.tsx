import { ReplyIcon, ShareIcon } from "@lume/icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useTranslation } from "react-i18next";
import { useNoteContext } from "../provider";
import { useArk } from "@lume/ark";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function NoteReply() {
  const ark = useArk();
  const event = useNoteContext();

  const { t } = useTranslation();

  return (
    <DropdownMenu.Root>
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={150}>
          <DropdownMenu.Trigger asChild>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                className="size07 group inline-flex items-center justify-center text-neutral-800 dark:text-neutral-200"
              >
                <ReplyIcon className="size-5 group-hover:text-blue-500" />
              </button>
            </Tooltip.Trigger>
          </DropdownMenu.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className="data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-neutral-50 will-change-[transform,opacity] dark:bg-neutral-50 dark:text-neutral-950">
              {t("note.menu.viewThread")}
              <Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex w-[200px] flex-col overflow-hidden rounded-xl bg-black p-1 shadow-md shadow-neutral-500/20 focus:outline-none dark:bg-white">
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => ark.open_thread(event.id)}
              className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
            >
              <ShareIcon className="size-4" />
              {t("note.buttons.view")}
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => ark.open_editor(event.id)}
              className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
            >
              <ReplyIcon className="size-4" />
              {t("note.buttons.reply")}
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="fill-black dark:fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
