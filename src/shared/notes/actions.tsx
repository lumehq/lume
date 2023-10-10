import * as Tooltip from '@radix-ui/react-tooltip';
import { Link } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { FocusIcon, ThreadIcon } from '@shared/icons';
import { MoreActions } from '@shared/notes/actions/more';
import { NoteReaction } from '@shared/notes/actions/reaction';
import { NoteReply } from '@shared/notes/actions/reply';
import { NoteRepost } from '@shared/notes/actions/repost';
import { NoteZap } from '@shared/notes/actions/zap';

import { WidgetKinds, useWidgets } from '@stores/widgets';

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
  const { db } = useStorage();
  const setWidget = useWidgets((state) => state.setWidget);

  return (
    <Tooltip.Provider>
      <div className="-ml-1 mt-4 inline-flex w-full items-center">
        <div className="inline-flex items-center gap-8">
          <NoteReply id={id} pubkey={pubkey} root={root} />
          <NoteReaction id={id} pubkey={pubkey} />
          <NoteRepost id={id} pubkey={pubkey} />
          <NoteZap id={id} pubkey={pubkey} />
        </div>
        {extraButtons && (
          <div className="ml-auto">
            <div className="inline-flex items-center gap-3">
              <Tooltip.Root delayDuration={150}>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    onClick={() =>
                      setWidget(db, {
                        kind: WidgetKinds.local.thread,
                        title: 'Thread',
                        content: id,
                      })
                    }
                    className="group inline-flex h-7 w-7 items-center justify-center text-neutral-500 dark:text-neutral-300"
                  >
                    <ThreadIcon className="h-5 w-5 group-hover:text-blue-500" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className="-left-10 inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-200 px-3.5 text-sm text-neutral-900 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-800 dark:text-neutral-100">
                    Open thread
                    <Tooltip.Arrow className="fill-neutral-200 dark:fill-neutral-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              <MoreActions id={id} pubkey={pubkey} />
            </div>
          </div>
        )}
      </div>
    </Tooltip.Provider>
  );
}
