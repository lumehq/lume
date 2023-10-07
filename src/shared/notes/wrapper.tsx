import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ReactElement, cloneElement } from 'react';
import { twMerge } from 'tailwind-merge';

import { ChildNote, NoteActions } from '@shared/notes';
import { User } from '@shared/user';

export function NoteWrapper({
  event,
  children,
  root,
  reply,
  lighter = false,
}: {
  event: NDKEvent;
  children: ReactElement;
  repost?: boolean;
  root?: string;
  reply?: string;
  lighter?: boolean;
}) {
  return (
    <div className="h-min w-full px-3 pb-3">
      <div
        className={twMerge(
          'relative overflow-hidden rounded-xl px-3 py-4',
          !lighter ? 'bg-zinc-100 dark:bg-zinc-900' : 'bg-transparent'
        )}
      >
        <div className="relative">{root && <ChildNote id={root} />}</div>
        <div className="relative">{reply && <ChildNote id={reply} root={root} />}</div>
        <div className="relative flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} />
          <div className="-mt-4 flex items-start gap-3">
            <div className="w-10 shrink-0" />
            <div className="relative z-20 flex-1">
              {cloneElement(
                children,
                event.kind === 1 ? { content: event.content } : { event: event }
              )}
              <NoteActions id={event.id} pubkey={event.pubkey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
