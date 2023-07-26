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
    <div className="w-[400px] shrink-0 border-r border-zinc-900">
      <TitleBar id={params.id} title={params.title} />
      <div className="scrollbar-hide flex h-full w-full flex-col gap-3 overflow-y-auto pb-20 pt-1.5">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        ) : (
          <div className="h-min w-full px-3 pt-1.5">
            <div className="rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 pt-3">
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
          <NoteReplyForm id={params.content} pubkey={account.pubkey} />
          <RepliesList id={params.content} />
        </div>
      </div>
    </div>
  );
}
