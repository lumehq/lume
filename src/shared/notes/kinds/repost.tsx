import {
  NoteActions,
  NoteContent,
  NoteMetadata,
  NoteSkeleton,
  RepostUser,
} from '@shared/notes';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';
import { getRepostID } from '@utils/transform';
import { LumeEvent } from '@utils/types';

export function Repost({ event }: { event: LumeEvent }) {
  const repostID = getRepostID(event.tags);
  const { status, data } = useEvent(repostID, event.content as unknown as string);

  if (status === 'loading') {
    return (
      <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 py-3">
        <NoteSkeleton />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center overflow-hidden rounded-xl bg-white/10 px-3 py-3">
        <p className="text-white/50">Failed to fetch event: {repostID}</p>
      </div>
    );
  }

  return (
    <div className="h-min w-full px-3 py-1.5">
      <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 pt-3">
        <div className="relative flex flex-col">
          <div className="isolate flex flex-col -space-y-4">
            <RepostUser pubkey={event.pubkey} />
            <User pubkey={data.pubkey} time={data.created_at} isRepost={true} />
          </div>
          <div className="flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="relative z-20 flex-1">
              <NoteContent content={data.content} />
              <NoteActions id={repostID} pubkey={data.pubkey} />
            </div>
          </div>
          <NoteMetadata id={repostID} />
        </div>
      </div>
    </div>
  );
}
