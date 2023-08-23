import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useParams } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import {
  ArticleNote,
  FileNote,
  NoteActions,
  NoteReplyForm,
  NoteStats,
  TextNote,
  ThreadUser,
  UnknownNote,
} from '@shared/notes';
import { RepliesList } from '@shared/notes/replies/list';
import { NoteSkeleton } from '@shared/notes/skeleton';

import { useEvent } from '@utils/hooks/useEvent';

export function EventScreen() {
  const { id } = useParams();
  const { db } = useStorage();
  const { status, data } = useEvent(id);

  const renderKind = (event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Text:
        return <TextNote event={event} />;
      case NDKKind.Article:
        return <ArticleNote event={event} />;
      case 1063:
        return <FileNote event={event} />;
      default:
        return <UnknownNote event={event} />;
    }
  };

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
              <div className="mt-2">{renderKind(data)}</div>
              <div>
                <NoteActions id={id} pubkey={data.pubkey} noOpenThread={true} />
                <NoteStats id={id} />
              </div>
            </div>
          </div>
        )}
        <div className="px-3">
          <NoteReplyForm id={id} pubkey={db.account.pubkey} />
          <RepliesList id={id} />
        </div>
      </div>
    </div>
  );
}
