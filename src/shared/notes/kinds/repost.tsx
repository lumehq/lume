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
  const { status, data } = useEvent(repostID, event.content);

  if (status === 'loading') {
    return (
      <div className="relative overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 pt-3">
        <NoteSkeleton />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 py-3">
        <p className="text-zinc-400">Failed to fetch</p>
      </div>
    );
  }

  return (
    <div className="h-min w-full px-3 py-1.5">
      <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 pt-3">
        <div className="flex flex-col">
          <div className="isolate flex flex-col -space-y-4 overflow-hidden">
            <RepostUser pubkey={event.pubkey} />
            <User pubkey={data.pubkey} time={data.created_at} isRepost={true} />
          </div>
          <div className="relative z-20 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="flex-1">
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
