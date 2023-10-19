import { MemoizedTextNote, NoteActions, SubReply } from '@shared/notes';
import { User } from '@shared/user';

import { NDKEventWithReplies } from '@utils/types';

export function Reply({ event, root }: { event: NDKEventWithReplies; root?: string }) {
  return (
    <div className="relative h-min w-full">
      <div className="relative z-10">
        <div className="relative flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} eventId={event.id} />
          <div className="-mt-4 flex items-start gap-3">
            <div className="w-10 shrink-0" />
            <div className="flex-1">
              <MemoizedTextNote content={event.content} />
              <NoteActions
                id={event.id}
                pubkey={event.pubkey}
                root={root}
                extraButtons={false}
              />
            </div>
          </div>
        </div>
        <div className="pl-14">
          {event.replies ? (
            event.replies.map((sub) => <SubReply key={sub.id} event={sub} />)
          ) : (
            <div className="pb-3" />
          )}
        </div>
      </div>
    </div>
  );
}
