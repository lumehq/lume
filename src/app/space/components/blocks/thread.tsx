import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { useLiveThread } from '@app/space/hooks/useLiveThread';

import { getNoteByID, removeBlock } from '@libs/storage';

import { NoteMetadata } from '@shared/notes/metadata';
import { NoteReplyForm } from '@shared/notes/replies/form';
import { RepliesList } from '@shared/notes/replies/list';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';
import { User } from '@shared/user';

import { useAccount } from '@utils/hooks/useAccount';
import { parser } from '@utils/parser';

export function ThreadBlock({ params }: { params: any }) {
  useLiveThread(params.content);

  const queryClient = useQueryClient();

  const { account } = useAccount();
  const { status, data } = useQuery(['thread', params.content], async () => {
    const res = await getNoteByID(params.content);
    res['content'] = parser(res);
    return res;
  });

  const block = useMutation({
    mutationFn: (id: string) => {
      return removeBlock(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
    },
  });

  return (
    <div className="w-[400px] shrink-0 border-r border-zinc-900">
      <TitleBar title={params.title} onClick={() => block.mutate(params.id)} />
      <div className="scrollbar-hide flex h-full w-full flex-col gap-1.5 overflow-y-auto pb-20 pt-1.5">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="shadow-input rounded-md bg-zinc-900 px-3 py-3 shadow-black/20">
              <NoteSkeleton />
            </div>
          </div>
        ) : (
          <div className="h-min w-full px-3 py-1.5">
            <div className="rounded-md bg-zinc-900 px-5 pt-5">
              <User pubkey={data.pubkey} time={data.created_at} />
              <div className="mt-3">
                <Link to={`/app/note/${params.content}`}>Focus</Link>
              </div>
            </div>
            <div className="mt-3 rounded-md bg-zinc-900">
              {account && (
                <NoteReplyForm rootID={params.content} userPubkey={account.pubkey} />
              )}
            </div>
          </div>
        )}
        <div className="px-3">
          <RepliesList parent_id={params.content} />
        </div>
      </div>
    </div>
  );
}
