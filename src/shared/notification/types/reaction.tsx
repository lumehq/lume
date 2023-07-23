import { NDKEvent } from '@nostr-dev-kit/ndk';

import { MentionNote } from '@shared/notes';
import { NotiUser } from '@shared/notification';

import { formatCreatedAt } from '@utils/createdAt';

export function NotiReaction({ event }: { event: NDKEvent }) {
  const root = event.tags.find((e) => e[0] === 'e')?.[1];
  const createdAt = formatCreatedAt(event.created_at);

  return (
    <div className="flex h-min flex-col px-5 py-2">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-1">
          <NotiUser pubkey={event.pubkey} />
          <p className="leading-none text-zinc-400">reacted {event.content}</p>
        </div>
        <div>
          <span className="leading-none text-zinc-500">{createdAt}</span>
        </div>
      </div>
      <div className="-mt-4 pl-[35px]">{root && <MentionNote id={root} />}</div>
    </div>
  );
}
