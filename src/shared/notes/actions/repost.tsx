import * as Tooltip from '@radix-ui/react-tooltip';

import { RepostIcon } from '@shared/icons';

import { FULL_RELAYS } from '@stores/constants';

import { usePublish } from '@utils/hooks/usePublish';

export function NoteRepost({ id, pubkey }: { id: string; pubkey: string }) {
  const publish = usePublish();

  const submit = async () => {
    const tags = [
      ['e', id, FULL_RELAYS[0], 'root'],
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
          <RepostIcon className="h-5 w-5 text-zinc-300 group-hover:text-blue-400" />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="-left-10 select-none rounded-md border-t border-zinc-600/50 bg-zinc-700 px-3.5 py-1.5 text-sm leading-none text-zinc-100 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
          Repost
          <Tooltip.Arrow className="fill-zinc-700" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
