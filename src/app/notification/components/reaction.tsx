import { NDKEvent } from '@nostr-dev-kit/ndk';

import { NotiUser } from '@app/notification/components/user';

import { MentionNote } from '@shared/notes';

import { formatCreatedAt } from '@utils/createdAt';

export function NotiReaction({ event }: { event: NDKEvent }) {
  const root = event.tags.find((e) => e[0] === 'e')?.[1];
  const createdAt = formatCreatedAt(event.created_at);

  return (
    <div className="flex h-min flex-col px-3 py-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-1">
          <NotiUser pubkey={event.pubkey} />
          <p className="leading-none text-white/50">
            reacted {event.content} · {createdAt}
          </p>
        </div>
      </div>
      <div className="relative z-10 -mt-6 flex gap-3">
        <div className="h-10 w-10 shrink-0" />
        <div className="flex-1">{root && <MentionNote id={root} />}</div>
      </div>
    </div>
  );
}
