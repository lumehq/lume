import { NsfwIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Dispatch, SetStateAction } from "react";

export function NsfwToggle({
  nsfw,
  setNsfw,
  className,
}: {
  nsfw: boolean;
  setNsfw: Dispatch<SetStateAction<boolean>>;
  className?: string;
}) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            onClick={() => setNsfw((prev) => !prev)}
            className={cn(
              "inline-flex items-center justify-center",
              className,
              nsfw ? "bg-blue-500 text-white" : "",
            )}
          >
            <NsfwIcon className="size-4" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-neutral-50 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-50 dark:text-neutral-950">
            Mark as sensitive content
            <Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
