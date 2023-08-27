import { NDKEvent } from '@nostr-dev-kit/ndk';

import { SimpleNote } from '@app/notifications/components/simpleNote';
import { NotiUser } from '@app/notifications/components/user';

import { formatCreatedAt } from '@utils/createdAt';

export function NotiReaction({ event }: { event: NDKEvent }) {
  const root = event.tags.find((e) => e[0] === 'e')?.[1];
  const createdAt = formatCreatedAt(event.created_at);

  return (
    <div className="h-min w-full px-3 py-1.5">
      <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 pt-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-1">
            <NotiUser pubkey={event.pubkey} />
            <p className="leading-none text-white/50">
              reacted {event.content} · {createdAt}
            </p>
          </div>
        </div>
        <div className="relative z-10 -mt-6 flex gap-3">
          <div className="h-11 w-11 shrink-0" />
          <div className="flex-1">{root && <SimpleNote id={root} />}</div>
        </div>
      </div>
    </div>
  );
}
