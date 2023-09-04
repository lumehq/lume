import { NDKEvent } from '@nostr-dev-kit/ndk';

import { NoteActions, TextNote } from '@shared/notes';
import { User } from '@shared/user';

export function SubReply({ event }: { event: NDKEvent }) {
  return (
    <div className="relative z-10 mb-3 mt-5 flex flex-col">
      <User pubkey={event.pubkey} time={event.created_at} />
      <div className="-mt-6 flex items-start gap-3">
        <div className="w-11 shrink-0" />
        <div className="flex-1">
          <TextNote content={event.content} />
          <NoteActions id={event.id} pubkey={event.pubkey} />
        </div>
      </div>
    </div>
  );
}
