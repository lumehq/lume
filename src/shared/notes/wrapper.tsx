import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ReactNode } from 'react';

import { ChildNote, NoteActions } from '@shared/notes';
import { User } from '@shared/user';

export function NoteWrapper({
  event,
  children,
  root,
  reply,
}: {
  event: NDKEvent;
  children: ReactNode;
  repost?: boolean;
  root?: string;
  reply?: string;
}) {
  return (
    <div className="h-min w-full px-3 pb-3">
      <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
        <div className="relative">{root && <ChildNote id={root} />}</div>
        <div className="relative">{reply && <ChildNote id={reply} root={root} />}</div>
        <div className="relative flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} />
          <div className="-mt-6 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="relative z-20 flex-1">
              {children}
              <NoteActions id={event.id} pubkey={event.pubkey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
