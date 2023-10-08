import * as Tooltip from '@radix-ui/react-tooltip';

import { ReplyIcon } from '@shared/icons';

import { useComposer } from '@stores/composer';

export function NoteReply({
  id,
  pubkey,
  root,
}: {
  id: string;
  pubkey: string;
  root?: string;
}) {
  const setReply = useComposer((state) => state.setReply);

  return (
    <Tooltip.Root delayDuration={150}>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          onClick={() => setReply(id, pubkey, root)}
          className="group inline-flex h-7 w-7 items-center justify-center text-zinc-500 dark:text-zinc-300"
        >
          <ReplyIcon className="h-5 w-5 group-hover:text-green-500" />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="-left-10 select-none rounded-md bg-black px-3.5 py-1.5 text-sm leading-none text-white will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
          Quick reply
          <Tooltip.Arrow className="fill-black" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
