import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

import { NotiContent } from '@app/notifications/components/content';
import { NotiUser } from '@app/notifications/components/user';

import { formatCreatedAt } from '@utils/createdAt';
import { parser } from '@utils/parser';

export function NotiMention({ event }: { event: NDKEvent }) {
  const createdAt = formatCreatedAt(event.created_at);
  const content = useMemo(() => parser(event), [event]);

  return (
    <div className="h-min w-full px-3 py-1.5">
      <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 pt-3 backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-1">
            <NotiUser pubkey={event.pubkey} />
            <p className="leading-none text-white/50">has reply you post · {createdAt}</p>
          </div>
        </div>
        <div className="f- relative z-10 -mt-6 flex gap-3">
          <div className="h-11 w-11 shrink-0" />
          <div className="mb-2 mt-3 w-full cursor-default rounded-lg bg-white/10 px-3 py-3 backdrop-blur-xl">
            <NotiContent content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
