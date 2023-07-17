import { NoteActions, NoteContent } from '@shared/notes';
import { User } from '@shared/user';

import { parser } from '@utils/parser';
import { LumeEvent } from '@utils/types';

export function Reply({ data }: { data: LumeEvent }) {
  const content = parser(data);

  return (
    <div className="h-min w-full py-1.5">
      <div className="relative overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 pt-3">
        <div className="relative flex flex-col">
          <User pubkey={data.pubkey} time={data.created_at} />
          <div className="relative z-20 -mt-6 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="flex-1">
              <NoteContent content={content} />
              <NoteActions id={data.event_id || data.id} pubkey={data.pubkey} />
            </div>
          </div>
          <div className="pb-3" />
        </div>
      </div>
    </div>
  );
}
