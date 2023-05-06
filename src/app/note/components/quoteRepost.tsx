import { RootNote } from '@lume/app/note/components/rootNote';
import { NoteRepostUser } from '@lume/app/note/components/user/repost';
import { getQuoteID } from '@lume/utils/transform';

import { memo } from 'react';

export const NoteQuoteRepost = memo(function NoteQuoteRepost({ event }: { event: any }) {
  const rootID = getQuoteID(event.tags);

  return (
    <div className="h-min w-full select-text px-3 py-1.5">
      <div className="rounded-md border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
        <div className="rounded-t-md border-b border-zinc-800 bg-zinc-950 px-3 py-2">
          <NoteRepostUser pubkey={event.pubkey} time={event.created_at} />
        </div>
        <RootNote id={rootID} fallback={event.content} />
      </div>
    </div>
  );
});
