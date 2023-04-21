import { RootNote } from '@components/note/rootNote';
import { UserQuoteRepost } from '@components/user/quoteRepost';

import destr from 'destr';
import { memo } from 'react';

export const NoteQuoteRepost = memo(function NoteQuoteRepost({ event }: { event: any }) {
  const rootNote = () => {
    let note = null;

    if (event.content.length > 0) {
      const content = destr(event.content);
      if (content) {
        note = <RootNote event={content} />;
      }
    } else {
      note = <RootNote event={event.tags[0][1]} />;
    }

    return note;
  };

  return (
    <div className="relative z-10 flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 px-3 py-5 hover:bg-black/20">
      <div className="relative z-10 flex flex-col pb-5">
        <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
        <UserQuoteRepost pubkey={event.pubkey} time={event.created_at} />
      </div>
      {rootNote()}
    </div>
  );
});
