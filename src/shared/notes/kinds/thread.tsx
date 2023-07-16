import { useMemo } from 'react';

import { NoteActions, NoteContent, NoteMetadata, SubNote } from '@shared/notes';
import { User } from '@shared/user';

import { parser } from '@utils/parser';
import { LumeEvent } from '@utils/types';

export function NoteThread({
  event,
  root,
  reply,
}: {
  event: LumeEvent;
  root: string;
  reply: string;
}) {
  const content = useMemo(() => parser(event), [event.id]);

  return (
    <div className="h-min w-full px-3 py-1.5">
      <div className="overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 pt-3">
        <div className="relative">{root && <SubNote id={root} />}</div>
        <div className="relative">{reply && <SubNote id={reply} />}</div>
        <div className="relative flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} />
          <div className="relative z-20 -mt-6 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="flex-1">
              <NoteContent content={content} />
              <NoteActions id={event.event_id} pubkey={event.pubkey} />
            </div>
          </div>
          <NoteMetadata id={event.event_id} />
        </div>
      </div>
    </div>
  );
}
