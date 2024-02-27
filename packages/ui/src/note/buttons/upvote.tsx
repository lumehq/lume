import { ArrowUpIcon, LoaderIcon } from "@lume/icons";
import { useState } from "react";
import { useNoteContext } from "../provider";
import { useArk } from "@lume/ark";
import { cn } from "@lume/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useTranslation } from "react-i18next";

export function NoteUpvote() {
  const ark = useArk();
  const event = useNoteContext();

  const [t] = useTranslation();
  const [reaction, setReaction] = useState<"+" | null>(null);
  const [loading, setLoading] = useState(false);

  const up = async () => {
    // start loading
    setLoading(true);

    const res = await ark.upvote(event.id, event.pubkey);
    if (res) setReaction("+");

    // stop loading
    setLoading(false);
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            onClick={up}
            disabled={!!reaction || loading}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-full",
              reaction === "+"
                ? "bg-blue-500 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-blue-500 hover:text-white dark:bg-neutral-900 dark:text-neutral-300",
            )}
          >
            {loading ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon className="size-4" />
            )}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-neutral-50 will-change-[transform,opacity] dark:bg-neutral-50 dark:text-neutral-950">
            {t("note.buttons.upvote")}
            <Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
