import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

import { NoteActions, NoteContent, NoteMetadata } from '@shared/notes';
import { User } from '@shared/user';

import { parser } from '@utils/parser';

export function NoteKind_1({
  event,
  skipMetadata = false,
}: {
  event: NDKEvent;
  skipMetadata?: boolean;
}) {
  const content = useMemo(() => parser(event), [event.id]);

  return (
    <div className="h-min w-full px-3 py-1.5">
      <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 pt-3">
        <div className="relative flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} />
          <div className="-mt-6 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="relative z-20 flex-1">
              <NoteContent content={content} />
              <NoteActions id={event.id || event.id} pubkey={event.pubkey} />
            </div>
          </div>
          {!skipMetadata ? (
            <NoteMetadata id={event.id || event.id} />
          ) : (
            <div className="pb-3" />
          )}
        </div>
      </div>
    </div>
  );
}
