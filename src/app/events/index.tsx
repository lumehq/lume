import { useParams } from 'react-router-dom';

import {
  NoteActions,
  NoteContent,
  NoteReplyForm,
  NoteStats,
  ThreadUser,
} from '@shared/notes';
import { RepliesList } from '@shared/notes/replies/list';
import { NoteSkeleton } from '@shared/notes/skeleton';

import { useAccount } from '@utils/hooks/useAccount';
import { useEvent } from '@utils/hooks/useEvent';

export function EventScreen() {
  const { id } = useParams();
  const { account } = useAccount();
  const { status, data } = useEvent(id);

  return (
    <div className="mx-auto w-[600px]">
      <div className="scrollbar-hide flex h-full w-full flex-col gap-1.5 overflow-y-auto pt-11">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        ) : (
          <div className="h-min w-full px-3 pt-1.5">
            <div className="rounded-xl bg-white/10 px-3 pt-3">
              <ThreadUser pubkey={data.pubkey} time={data.created_at} />
              <div className="mt-2">
                <NoteContent content={data.content} />
              </div>
              <div>
                <NoteActions id={id} pubkey={data.pubkey} noOpenThread={true} />
                <NoteStats id={id} />
              </div>
            </div>
          </div>
        )}
        <div className="px-3">
          <NoteReplyForm id={id} pubkey={account.pubkey} />
          <RepliesList id={id} />
        </div>
      </div>
    </div>
  );
}
