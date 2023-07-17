import { useMutation, useQueryClient } from '@tanstack/react-query';

// import { useLiveThread } from '@app/space/hooks/useLiveThread';
import { removeBlock } from '@libs/storage';

import { NoteContent, NoteStats, ThreadUser } from '@shared/notes';
import { RepliesList } from '@shared/notes/replies/list';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';

import { useEvent } from '@utils/hooks/useEvent';
import { Block } from '@utils/types';

export function ThreadBlock({ params }: { params: Block }) {
  const queryClient = useQueryClient();

  const { status, data } = useEvent(params.content);

  const block = useMutation({
    mutationFn: (id: string) => {
      return removeBlock(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
    },
  });

  // subscribe to live reply
  // useLiveThread(params.content);

  return (
    <div className="w-[400px] shrink-0 border-r border-zinc-900">
      <TitleBar title={params.title} onClick={() => block.mutate(params.id)} />
      <div className="scrollbar-hide flex h-full w-full flex-col gap-1.5 overflow-y-auto pb-20 pt-1.5">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        ) : (
          <div className="h-min w-full px-3 py-1.5">
            <div className="rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 pt-3">
              <ThreadUser pubkey={data.pubkey} time={data.created_at} />
              <div className="mt-2">
                <NoteContent content={data.content} />
              </div>
              <div>
                <NoteStats id={data.id} />
              </div>
            </div>
          </div>
        )}
        <div className="px-3">
          <RepliesList id={params.content} />
        </div>
      </div>
    </div>
  );
}
