import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useCallback } from 'react';

import {
  ArticleNote,
  FileNote,
  NoteActions,
  NoteMetadata,
  NoteSkeleton,
  RepostUser,
  TextNote,
  UnknownNote,
} from '@shared/notes';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';

export function Repost({ event }: { event: NDKEvent }) {
  const repostID = event.tags.find((el) => el[0] === 'e')[1] ?? '';
  const { status, data } = useEvent(repostID, event.content as unknown as string);

  const renderKind = useCallback(
    (event: NDKEvent) => {
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
    },
    [event]
  );

  if (status === 'loading') {
    return (
      <div className="h-min w-full px-3 pb-3">
        <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
          <NoteSkeleton />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="h-min w-full px-3 pb-3">
        <div className="flex flex-col gap-1 overflow-hidden rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
          <p className="select-text break-all text-white/50">
            Failed to get repost with ID
          </p>
          <div className="break-all rounded-lg bg-white/10 px-2 py-2 backdrop-blur-xl">
            <p className="text-white">{repostID}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-min w-full px-3 pb-3">
      <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 pt-3 backdrop-blur-xl">
        <div className="relative flex flex-col">
          <div className="isolate flex flex-col -space-y-4">
            <RepostUser pubkey={event.pubkey} />
            <User pubkey={data.pubkey} time={data.created_at} isRepost={true} />
          </div>
          <div className="-mt-2 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="relative z-20 flex-1">
              {renderKind(data)}
              <NoteActions id={repostID} pubkey={data.pubkey} />
            </div>
          </div>
          <NoteMetadata id={repostID} />
        </div>
      </div>
    </div>
  );
}
