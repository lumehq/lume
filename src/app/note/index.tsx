import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { useLiveThread } from '@app/space/hooks/useLiveThread';

import { getNoteByID } from '@libs/storage';

import { Kind1 } from '@shared/notes/contents/kind1';
import { Kind1063 } from '@shared/notes/contents/kind1063';
import { NoteMetadata } from '@shared/notes/metadata';
import { NoteReplyForm } from '@shared/notes/replies/form';
import { RepliesList } from '@shared/notes/replies/list';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { User } from '@shared/user';

import { useAccount } from '@utils/hooks/useAccount';
import { parser } from '@utils/parser';

export function NoteScreen() {
  const { id } = useParams();
  const { account } = useAccount();
  const { status, data } = useQuery(['thread', id], async () => {
    const res = await getNoteByID(id);
    res['content'] = parser(res);
    return res;
  });

  useLiveThread(id);

  return (
    <div className="mx-auto w-[600px]">
      <div className="scrollbar-hide flex h-full w-full flex-col gap-1.5 overflow-y-auto pb-20 pt-16">
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
                {data.kind === 1 && <Kind1 content={data.content} />}
                {data.kind === 1063 && <Kind1063 metadata={data.tags} />}
                <NoteMetadata id={data.event_id || id} eventPubkey={data.pubkey} />
              </div>
            </div>
            <div className="mt-3 rounded-md bg-zinc-900">
              {account && <NoteReplyForm rootID={id} userPubkey={account.pubkey} />}
            </div>
          </div>
        )}
        <div className="px-3">
          <RepliesList parent_id={id} />
        </div>
      </div>
    </div>
  );
}