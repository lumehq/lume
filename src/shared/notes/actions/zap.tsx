import { NostrEvent } from '@nostr-dev-kit/ndk';
import * as Tooltip from '@radix-ui/react-tooltip';

import { ZapIcon } from '@shared/icons';

import { useEvent } from '@utils/hooks/useEvent';
import { usePublish } from '@utils/hooks/usePublish';

export function NoteZap({ id }: { id: string }) {
  const { createZap } = usePublish();
  const { data: event } = useEvent(id);

  const submit = async () => {
    const res = await createZap(event as NostrEvent, 21000);
    console.log(res);
  };

  return (
    <Tooltip.Root delayDuration={150}>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          onClick={() => submit()}
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
