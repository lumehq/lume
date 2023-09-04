import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useCallback } from 'react';

import {
  ArticleNote,
  FileNote,
  NoteActions,
  NoteSkeleton,
  RepostUser,
  TextNote,
  UnknownNote,
} from '@shared/notes';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';

export function Repost({ event }: { event: NDKEvent & { root_id: string } }) {
  const { status, data } = useEvent(event.root_id, event.content);

  const renderKind = useCallback(
    (repostEvent: NDKEvent) => {
      switch (repostEvent.kind) {
        case NDKKind.Text:
          return <TextNote content={repostEvent.content} />;
        case NDKKind.Article:
          return <ArticleNote event={repostEvent} />;
        case 1063:
          return <FileNote event={repostEvent} />;
        default:
          return <UnknownNote event={repostEvent} />;
      }
    },
    [data]
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
            Failed to get post with ID
          </p>
          <div className="break-all rounded-lg bg-white/10 px-2 py-2 backdrop-blur-xl">
            <p className="text-white">{event.id}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-min w-full px-3 pb-3">
      <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
        <div className="relative flex flex-col">
          <div className="isolate flex flex-col -space-y-4">
            <RepostUser pubkey={event.pubkey} />
            <User pubkey={data.pubkey} time={data.created_at} isRepost={true} />
          </div>
          <div className="-mt-2 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="relative z-20 flex-1">
              {renderKind(data)}
              <NoteActions id={data.id} pubkey={data.pubkey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
