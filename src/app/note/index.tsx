import { useParams } from 'react-router-dom';

import { useLiveThread } from '@app/space/hooks/useLiveThread';

import { NoteMetadata } from '@shared/notes/metadata';
import { NoteReplyForm } from '@shared/notes/replies/form';
import { RepliesList } from '@shared/notes/replies/list';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { User } from '@shared/user';

import { useAccount } from '@utils/hooks/useAccount';
import { useEvent } from '@utils/hooks/useEvent';

export function NoteScreen() {
  const { id } = useParams();
  const { account } = useAccount();
  const { status, data } = useEvent(id);

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
                <NoteMetadata id={data.event_id || id} />
              </div>
            </div>
            <div className="mt-3 rounded-md bg-zinc-900">
              {account && <NoteReplyForm rootID={id} userPubkey={account.pubkey} />}
            </div>
          </div>
        )}
        <div className="px-3">
          <RepliesList id={id} />
        </div>
      </div>
    </div>
  );
}
