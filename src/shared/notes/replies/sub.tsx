import { NDKEvent } from '@nostr-dev-kit/ndk';

import { MemoizedTextKind, NoteActions } from '@shared/notes';
import { User } from '@shared/user';

export function SubReply({ event }: { event: NDKEvent }) {
  return (
    <div className="flex flex-col gap-2">
      <User pubkey={event.pubkey} time={event.created_at} eventId={event.id} />
      <MemoizedTextKind content={event.content} />
      <div className="-ml-1">
        <NoteActions id={event.id} pubkey={event.pubkey} extraButtons={false} />
      </div>
    </div>
  );
}
