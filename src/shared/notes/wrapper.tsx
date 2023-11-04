import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ReactElement, cloneElement, useMemo } from 'react';

import { ChildNote, NoteActions } from '@shared/notes';
import { User } from '@shared/user';

export function NoteWrapper({
  event,
  children,
}: {
  event: NDKEvent;
  children: ReactElement;
}) {
  const root = useMemo(() => {
    if (event.tags?.[0]?.[0] === 'e' && !event.tags?.[0]?.[3]) {
      return event.tags[0][1];
    }
    return event.tags.find((el) => el[3] === 'root')?.[1];
  }, [event]);

  const reply = useMemo(() => event.tags.find((el) => el[3] === 'reply')?.[1], []);

  return (
    <div className="h-min w-full px-3 pb-3">
      <div className="relative overflow-hidden rounded-xl bg-neutral-100 px-3 py-4 dark:bg-neutral-900">
        <div className="relative">{root && <ChildNote id={root} />}</div>
        <div className="relative">{reply && <ChildNote id={reply} root={root} />}</div>
        <div className="relative flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} eventId={event.id} />
          <div className="-mt-4 flex items-start gap-3">
            <div className="w-10 shrink-0" />
            <div className="relative z-20 min-w-0 flex-1">
              {cloneElement(
                children,
                event.kind === 1 ? { content: event.content } : { event: event }
              )}
              <NoteActions id={event.id} pubkey={event.pubkey} root={root} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
