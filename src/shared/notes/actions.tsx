import * as Tooltip from '@radix-ui/react-tooltip';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBlock } from '@libs/storage';

import { ThreadIcon } from '@shared/icons';
import { NoteReaction } from '@shared/notes/actions/reaction';
import { NoteReply } from '@shared/notes/actions/reply';
import { NoteRepost } from '@shared/notes/actions/repost';
import { NoteZap } from '@shared/notes/actions/zap';

import { BLOCK_KINDS } from '@stores/constants';

export function NoteActions({
  id,
  pubkey,
  noOpenThread,
}: {
  id: string;
  pubkey: string;
  noOpenThread?: boolean;
}) {
  const queryClient = useQueryClient();

  const block = useMutation({
    mutationFn: (data: { kind: number; title: string; content: string }) => {
      return createBlock(data.kind, data.title, data.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
    },
  });

  const openThread = (thread: string) => {
    block.mutate({ kind: BLOCK_KINDS.thread, title: 'Thread', content: thread });
  };

  return (
    <Tooltip.Provider>
      <div className="-ml-1 mt-4 inline-flex w-full items-center">
        <div className="inline-flex items-center gap-2">
          <NoteReply id={id} pubkey={pubkey} />
          <NoteReaction id={id} pubkey={pubkey} />
          <NoteRepost id={id} pubkey={pubkey} />
          <NoteZap />
        </div>
        {!noOpenThread && (
          <>
            <div className="mx-2 block h-4 w-px bg-zinc-800" />
            <Tooltip.Root delayDuration={150}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  onClick={() => openThread(id)}
                  className="group inline-flex h-7 w-7 items-center justify-center"
                >
                  <ThreadIcon className="h-5 w-5 text-zinc-300 group-hover:text-fuchsia-400" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="-left-10 select-none rounded-md border-t border-zinc-600/50 bg-zinc-700 px-3.5 py-1.5 text-sm leading-none text-zinc-100 backdrop-blur-lg will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
                  Open thread
                  <Tooltip.Arrow className="fill-zinc-700" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </>
        )}
      </div>
    </Tooltip.Provider>
  );
}
