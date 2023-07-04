import * as Tooltip from '@radix-ui/react-tooltip';

import { ZapIcon } from '@shared/icons';

import { compactNumber } from '@utils/number';

export function NoteZap({ zaps }: { zaps: number }) {
  return (
    <Tooltip.Root delayDuration={150}>
      <button
        type="button"
        className="group group inline-flex h-6 w-20 items-center gap-1.5"
      >
        <Tooltip.Trigger asChild>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded group-hover:bg-zinc-800">
            <ZapIcon className="h-4 w-4 text-zinc-400 group-hover:text-orange-400" />
          </span>
        </Tooltip.Trigger>
        <span className="text-base leading-none text-zinc-400 group-hover:text-zinc-100">
          {compactNumber.format(zaps)}
        </span>
      </button>
      <Tooltip.Portal>
        <Tooltip.Content
          className="-left-10 select-none rounded-md bg-zinc-800/80 px-3.5 py-1.5 text-sm leading-none text-zinc-100 backdrop-blur-lg will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
          sideOffset={5}
        >
          Coming Soon
          <Tooltip.Arrow className="fill-zinc-800/80 backdrop-blur-lg" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
