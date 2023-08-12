import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

import { MentionNote, NoteContent } from '@shared/notes';
import { NotiUser } from '@shared/notification';

import { formatCreatedAt } from '@utils/createdAt';
import { parser } from '@utils/parser';

export function NotiMention({ event }: { event: NDKEvent }) {
  const replyTo = event.tags.find((e) => e[0] === 'e')?.[1];
  const createdAt = formatCreatedAt(event.created_at);
  const content = useMemo(() => parser(event), [event]);

  return (
    <div className="flex h-min flex-col px-3 py-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-1">
          <NotiUser pubkey={event.pubkey} />
          <p className="leading-none text-white/50">reply your postr</p>
        </div>
        <span className="leading-none text-white/50">{createdAt}</span>
      </div>
      <div className="-mt-3 pl-[44px]">
        <NoteContent content={content} />
        {replyTo && <MentionNote id={replyTo} />}
      </div>
    </div>
  );
}
