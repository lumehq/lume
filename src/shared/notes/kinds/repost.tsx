import { NDKEvent } from '@nostr-dev-kit/ndk';

import {
  NoteActions,
  NoteContent,
  NoteMetadata,
  NoteSkeleton,
  RepostUser,
} from '@shared/notes';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';

export function Repost({ event }: { event: NDKEvent }) {
  const repostID = event.tags.find((el) => el[0] === 'e')?.[1];
  const { status, data } = useEvent(repostID, event.content as unknown as string);

  if (status === 'loading') {
    return (
      <div className="h-min w-full px-3 py-1.5">
        <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 py-3">
          <NoteSkeleton />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="h-min w-full px-3 py-1.5">
        <div className="flex flex-col gap-1 overflow-hidden rounded-xl bg-white/10 px-3 py-3">
          <p className="select-text break-all text-white/50">
            Failed to get repostr with ID
          </p>
          <div className="break-all rounded-lg bg-white/10 px-2 py-2">
            <p className="text-white">{repostID}</p>
          </div>
        </div>
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
