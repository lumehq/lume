import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

import { NoteActions, NoteContent, NoteMetadata, SubNote } from '@shared/notes';
import { User } from '@shared/user';

import { parser } from '@utils/parser';

export function NoteThread({
  event,
  root,
  reply,
}: {
  event: NDKEvent;
  root: string;
  reply: string;
}) {
  const content = useMemo(() => parser(event), [event.id]);

  return (
    <div className="h-min w-full px-3 py-1.5">
      <div className="overflow-hidden rounded-xl bg-white/10 px-3 pt-3">
        <div className="relative">{root && <SubNote id={root} />}</div>
        <div className="relative">{reply && <SubNote id={reply} root={root} />}</div>
        <div className="relative flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} />
          <div className="-mt-6 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="relative z-20 flex-1">
              <NoteContent content={content} />
              <NoteActions id={event.id} pubkey={event.pubkey} />
            </div>
          </div>
          <NoteMetadata id={event.id} />
        </div>
      </div>
    </div>
  );
}
