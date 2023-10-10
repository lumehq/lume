import { NoteActions, SubReply, TextNote } from '@shared/notes';
import { User } from '@shared/user';

import { NDKEventWithReplies } from '@utils/types';

export function Reply({ event, root }: { event: NDKEventWithReplies; root?: string }) {
  return (
    <div className="relative h-min w-full">
      {event?.replies?.length > 0 && (
        <div className="absolute -left-3 top-0 h-[calc(100%-1.2rem)] w-px bg-gradient-to-t from-blue-200 via-red-200 to-orange-300" />
      )}
      <div className="relative z-10">
        <div className="relative flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} />
          <div className="-mt-5 flex items-start gap-3">
            <div className="w-10 shrink-0" />
            <div className="flex-1">
              <TextNote content={event.content} />
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
