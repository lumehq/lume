import * as Tooltip from '@radix-ui/react-tooltip';
import { PinIcon } from '@shared/icons';

export function NotePin({ action }: { action: () => void }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            onClick={action}
            className="inline-flex h-7 w-max items-center justify-center gap-2 rounded-full bg-neutral-100 px-2 text-sm font-medium dark:bg-neutral-900"
          >
            <PinIcon className="size-4" />
            Pin
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="-left-10 inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-200 px-3.5 text-sm text-neutral-900 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-800 dark:text-neutral-100">
            Pin note
            <Tooltip.Arrow className="fill-neutral-200 dark:fill-neutral-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
