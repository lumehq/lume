import * as Tooltip from '@radix-ui/react-tooltip';

import { ZapIcon } from '@shared/icons';

export function NoteZap() {
  return (
    <Tooltip.Root delayDuration={150}>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          className="group inline-flex h-7 w-7 items-center justify-center"
        >
          <ZapIcon className="h-5 w-5 text-zinc-300 group-hover:text-orange-400" />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="-left-10 select-none rounded-md border-t border-zinc-600/50 bg-zinc-700 px-3.5 py-1.5 text-sm leading-none text-zinc-100 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
          Tip
          <Tooltip.Arrow className="fill-zinc-700" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
