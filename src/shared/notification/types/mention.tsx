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
    <div className="flex h-min flex-col px-5 py-2">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-1">
          <NotiUser pubkey={event.pubkey} />
          <p className="leading-none text-white/50">reply your post</p>
        </div>
        <div>
          <span className="leading-none text-zinc-500">{createdAt}</span>
        </div>
      </div>
      <div className="-mt-4 pl-[35px]">
        <div>
          <NoteContent content={content} />
        </div>
        {replyTo && <MentionNote id={replyTo} />}
      </div>
    </div>
  );
}
