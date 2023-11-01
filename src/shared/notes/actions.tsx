import * as Tooltip from '@radix-ui/react-tooltip';

import { FocusIcon } from '@shared/icons';
import { NoteReaction } from '@shared/notes/actions/reaction';
import { NoteReply } from '@shared/notes/actions/reply';
import { NoteRepost } from '@shared/notes/actions/repost';
import { NoteZap } from '@shared/notes/actions/zap';

import { WidgetKinds } from '@stores/constants';

import { useWidget } from '@utils/hooks/useWidget';

export function NoteActions({
  id,
  pubkey,
  extraButtons = true,
  root,
}: {
  id: string;
  pubkey: string;
  extraButtons?: boolean;
  root?: string;
}) {
  const { addWidget } = useWidget();

  return (
    <Tooltip.Provider>
      <div className="-ml-1 mt-2 inline-flex w-full items-center">
        <div className="inline-flex items-center gap-10">
          <NoteReply id={id} pubkey={pubkey} root={root} />
          <NoteReaction id={id} pubkey={pubkey} />
          <NoteRepost id={id} pubkey={pubkey} />
          <NoteZap id={id} pubkey={pubkey} />
        </div>
        {extraButtons && (
          <div className="ml-auto inline-flex items-center gap-3">
            <Tooltip.Root delayDuration={150}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  onClick={() =>
                    addWidget.mutate({
                      kind: WidgetKinds.local.thread,
                      title: 'Thread',
                      content: id,
                    })
                  }
                  className="group inline-flex h-7 w-7 items-center justify-center text-neutral-500 dark:text-neutral-300"
                >
                  <FocusIcon className="h-5 w-5 group-hover:text-blue-500" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="-left-10 inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-200 px-3.5 text-sm text-neutral-900 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-800 dark:text-neutral-100">
                  Open thread
                  <Tooltip.Arrow className="fill-neutral-200 dark:fill-neutral-800" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        )}
      </div>
    </Tooltip.Provider>
  );
}
