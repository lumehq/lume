import * as Tooltip from '@radix-ui/react-tooltip';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBlock } from '@libs/storage';

import { ThreadIcon } from '@shared/icons';
import { NoteReaction } from '@shared/notes/actions/reaction';
import { NoteReply } from '@shared/notes/actions/reply';
import { NoteRepost } from '@shared/notes/actions/repost';
import { NoteZap } from '@shared/notes/actions/zap';

export function NoteActions({ id, pubkey }: { id: string; pubkey: string }) {
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
    block.mutate({ kind: 2, title: 'Thread', content: thread });
  };

  return (
    <Tooltip.Provider>
      <div className="-ml-1 mt-4 inline-flex w-full items-center">
        <div className="inline-flex items-center gap-2">
          <NoteReply id={id} pubkey={pubkey} />
          <NoteRepost id={id} pubkey={pubkey} />
          <NoteReaction />
          <NoteZap />
        </div>
        <div className="mx-2 block h-4 w-px bg-zinc-800" />
        <button
          type="button"
          onClick={() => openThread(id)}
          className="group inline-flex h-7 w-7 items-center justify-center"
        >
          <ThreadIcon className="h-5 w-5 text-zinc-300 group-hover:text-fuchsia-400" />
        </button>
      </div>
    </Tooltip.Provider>
  );
}
