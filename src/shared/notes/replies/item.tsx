import { useMemo } from 'react';

import { NoteActions, NoteContent, SubReply } from '@shared/notes';
import { User } from '@shared/user';

import { parser } from '@utils/parser';
import { LumeEvent } from '@utils/types';

export function Reply({ event, root }: { event: LumeEvent; root?: string }) {
  const content = useMemo(() => parser(event), [event]);

  return (
    <div className="h-min w-full py-1.5">
      <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 pt-3">
        <div className="relative flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} />
          <div className="relative z-20 -mt-6 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="flex-1">
              <NoteContent content={content} />
              <NoteActions id={event.id || event.id} pubkey={event.pubkey} root={root} />
            </div>
          </div>
          <div>
            {event.replies ? (
              event.replies.map((sub) => <SubReply key={sub.id} event={sub} />)
            ) : (
              <div className="pb-3" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
