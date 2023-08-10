import * as Tooltip from '@radix-ui/react-tooltip';

import { RepostIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function NoteRepost({ id, pubkey }: { id: string; pubkey: string }) {
  const { publish } = useNostr();

  const submit = async () => {
    const tags = [
      ['e', id, 'wss://relayable.org', 'root'],
      ['p', pubkey],
    ];
    await publish({ content: '', kind: 6, tags: tags });
  };

  return (
    <Tooltip.Root delayDuration={150}>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          onClick={() => submit()}
          className="group inline-flex h-7 w-7 items-center justify-center"
        >
          <RepostIcon className="h-5 w-5 text-white group-hover:text-blue-400" />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="-left-10 select-none rounded-md bg-black px-3.5 py-1.5 text-sm leading-none text-white will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
          Repost
          <Tooltip.Arrow className="fill-black" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
