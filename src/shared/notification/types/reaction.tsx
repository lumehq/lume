import { NDKEvent } from '@nostr-dev-kit/ndk';

import { MentionNote } from '@shared/notes';
import { NotiUser } from '@shared/notification';

import { formatCreatedAt } from '@utils/createdAt';

export function NotiReaction({ event }: { event: NDKEvent }) {
  const root = event.tags.find((e) => e[0] === 'e')?.[1];
  const createdAt = formatCreatedAt(event.created_at);

  return (
    <div className="flex h-min flex-col px-3 py-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-1">
          <NotiUser pubkey={event.pubkey} />
          <p className="leading-none text-white/50">reacted {event.content}</p>
        </div>
        <div>
          <span className="leading-none text-white/50">{createdAt}</span>
        </div>
      </div>
      <div className="-mt-5 pl-[44px]">{root && <MentionNote id={root} />}</div>
    </div>
  );
}
