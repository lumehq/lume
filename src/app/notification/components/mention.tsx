import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

import { NotiContent } from '@app/notification/components/content';
import { NotiUser } from '@app/notification/components/user';

import { formatCreatedAt } from '@utils/createdAt';
import { parser } from '@utils/parser';

export function NotiMention({ event }: { event: NDKEvent }) {
  const createdAt = formatCreatedAt(event.created_at);
  const content = useMemo(() => parser(event), [event]);

  return (
    <div className="flex h-min flex-col px-3 py-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-1">
          <NotiUser pubkey={event.pubkey} />
          <p className="leading-none text-white/50">mention you · {createdAt}</p>
        </div>
      </div>
      <div className="relative z-10 -mt-6 flex gap-3">
        <div className="h-10 w-10 shrink-0" />
        <NotiContent content={content} />
      </div>
    </div>
  );
}
