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
      <div className="-ml-1 mt-2 inline-flex w-full items-center">
        <div className="inline-flex items-center gap-2">
          <NoteReply id={id} pubkey={pubkey} root={root} />
          <NoteReaction id={id} pubkey={pubkey} />
          <NoteRepost id={id} pubkey={pubkey} />
          <NoteZap id={id} />
        </div>
        {extraButtons && (
          <>
            <div className="mx-2 block h-4 w-px bg-white/10 backdrop-blur-xl" />
            <div className="inline-flex items-center gap-2">
              <Tooltip.Root delayDuration={150}>
                <Tooltip.Trigger asChild>
                  <Link
                    to={`/notes/text/${id}`}
                    className="group inline-flex h-7 w-7 items-center justify-center"
                  >
                    <FocusIcon className="h-5 w-5 text-white group-hover:text-fuchsia-400" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className="-left-10 select-none rounded-md bg-black px-3.5 py-1.5 text-sm leading-none text-white will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
                    Open thread
                    <Tooltip.Arrow className="fill-black" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              <Tooltip.Root delayDuration={150}>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    onClick={() =>
                      setWidget(db, {
                        kind: WidgetKinds.thread,
                        title: 'Thread',
                        content: id,
                      })
                    }
                    className="group inline-flex h-7 w-7 items-center justify-center"
                  >
                    <ThreadIcon className="h-5 w-5 text-white group-hover:text-fuchsia-400" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className="-left-10 select-none rounded-md bg-black px-3.5 py-1.5 text-sm leading-none text-white will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
                    Open thread
                    <Tooltip.Arrow className="fill-black" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>
          </>
        )}
        <MoreActions id={id} pubkey={pubkey} />
      </div>
    </Tooltip.Provider>
  );
}
