import { NoteActions, NoteContent, NoteSkeleton } from '@shared/notes';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';

export function SubNote({ id, root }: { id: string; root?: string }) {
  const { status, data } = useEvent(id);

  if (status === 'loading') {
    return (
      <div className="relative mb-5 overflow-hidden rounded-xl bg-white/10 py-3">
        <NoteSkeleton />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mb-5 flex overflow-hidden rounded-xl bg-white/10 px-3 py-3">
        <p className="text-white/50">Failed to fetch</p>
      </div>
    );
  }

  return (
    <>
      <div className="absolute bottom-0 left-[18px] h-[calc(100%-3.4rem)] w-0.5 bg-gradient-to-t from-white/20 to-white/10" />
      <div className="mb-5 flex flex-col">
        <User pubkey={data.pubkey} time={data.created_at} />
        <div className="relative z-20 -mt-6 flex items-start gap-3">
          <div className="w-11 shrink-0" />
          <div className="flex-1">
            <NoteContent content={data.content} />
            <NoteActions id={data.event_id} pubkey={data.pubkey} root={root} />
          </div>
        </div>
      </div>
    </>
  );
}
