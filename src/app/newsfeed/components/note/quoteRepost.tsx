import { RootNote } from '@lume/app/newsfeed/components/note/rootNote';
import { NoteRepostUser } from '@lume/app/newsfeed/components/user/repost';
import { getQuoteID } from '@lume/utils/transform';

import { memo } from 'react';

export const NoteQuoteRepost = memo(function NoteQuoteRepost({ event }: { event: any }) {
  const rootID = getQuoteID(event.tags);

  return (
    <div className="relative z-10 flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 px-3 py-5 hover:bg-black/20">
      <div className="relative z-10 flex flex-col pb-5">
        <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
        <NoteRepostUser pubkey={event.pubkey} time={event.created_at} />
      </div>
      <RootNote id={rootID} fallback={event.content} />
    </div>
  );
});
