import { NDKEvent } from '@nostr-dev-kit/ndk';

import { MemoizedTextNote, NoteActions } from '@shared/notes';
import { User } from '@shared/user';

export function SubReply({ event }: { event: NDKEvent }) {
  return (
    <div className="relative z-10 mb-3 mt-5 flex flex-col">
      <User pubkey={event.pubkey} time={event.created_at} eventId={event.id} />
      <div className="-mt-4 flex items-start gap-3">
        <div className="w-10 shrink-0" />
        <div className="flex-1">
          <MemoizedTextNote content={event.content} />
          <NoteActions id={event.id} pubkey={event.pubkey} extraButtons={false} />
        </div>
      </div>
    </div>
  );
}
