import { useMemo } from 'react';

import { NoteActions, NoteContent } from '@shared/notes';
import { User } from '@shared/user';

import { parser } from '@utils/parser';
import { LumeEvent } from '@utils/types';

export function SubReply({ event }: { event: LumeEvent }) {
  const content = useMemo(() => parser(event), [event]);

  return (
    <div className="relative mb-3 mt-5 flex flex-col">
      <User pubkey={event.pubkey} time={event.created_at} />
      <div className="relative z-20 -mt-6 flex items-start gap-3">
        <div className="w-11 shrink-0" />
        <div className="flex-1">
          <NoteContent content={content} />
          <NoteActions id={event.event_id || event.id} pubkey={event.pubkey} />
        </div>
      </div>
    </div>
  );
}
