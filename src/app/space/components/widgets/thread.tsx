import { useStorage } from '@libs/storage/provider';

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

import { useEvent } from '@utils/hooks/useEvent';
import { Widget } from '@utils/types';

export function ThreadBlock({ params }: { params: Widget }) {
  const { status, data } = useEvent(params.content);
  const { db } = useStorage();

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
              <ThreadUser pubkey={data.event.pubkey} time={data.event.created_at} />
              <div className="mt-2">
                <NoteContent content={data.richContent} />
              </div>
              <div>
                <NoteActions
                  id={params.content}
                  pubkey={data.event.pubkey}
                  noOpenThread={true}
                />
                <NoteStats id={params.content} />
              </div>
            </div>
          </div>
        )}
        <div className="px-3">
          <NoteReplyForm id={params.content} pubkey={db.account.pubkey} />
          <RepliesList id={params.content} />
        </div>
      </div>
    </div>
  );
}
