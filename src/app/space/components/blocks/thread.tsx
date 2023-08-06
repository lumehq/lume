// import { useLiveThread } from '@app/space/hooks/useLiveThread';
import {
  NoteActions,
  NoteContent,
  NoteReplyForm,
  NoteStats,
  ThreadUser,
} from '@shared/notes';
import { RepliesList } from '@shared/notes/replies/list';
import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';

import { useAccount } from '@utils/hooks/useAccount';
import { useEvent } from '@utils/hooks/useEvent';
import { Block } from '@utils/types';

export function ThreadBlock({ params }: { params: Block }) {
  const { status, data } = useEvent(params.content);
  const { account } = useAccount();

  // subscribe to live reply
  // useLiveThread(params.content);

  return (
    <div className="scrollbar-hide h-full w-[400px] shrink-0 overflow-y-auto bg-white/10 pb-20">
      <TitleBar id={params.id} title={params.title} />
      <div className="h-full">
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
                <NoteActions id={data.id} pubkey={data.pubkey} noOpenThread={true} />
                <NoteStats id={data.id} />
              </div>
            </div>
          </div>
        )}
        <div className="px-3">
          {account && <NoteReplyForm id={params.content} pubkey={account.pubkey} />}
          <RepliesList id={params.content} />
        </div>
      </div>
    </div>
  );
}
