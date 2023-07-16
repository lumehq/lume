import * as Tooltip from '@radix-ui/react-tooltip';

import { ReplyIcon } from '@shared/icons';

import { useComposer } from '@stores/composer';

export function NoteReply({ id, pubkey }: { id: string; pubkey: string }) {
  const setReply = useComposer((state) => state.setReply);

  return (
    <Tooltip.Root delayDuration={150}>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          onClick={() => setReply(id, pubkey)}
          className="group inline-flex h-7 w-7 items-center justify-center"
        >
          <ReplyIcon className="h-5 w-5 text-zinc-300 group-hover:text-green-500" />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="-left-10 select-none rounded-md bg-zinc-800/80 px-3.5 py-1.5 text-sm leading-none text-zinc-100 backdrop-blur-lg will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
          sideOffset={5}
        >
          Quick reply
          <Tooltip.Arrow className="fill-zinc-800/80 backdrop-blur-lg" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
