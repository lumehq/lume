import { RootNote } from '@lume/app/note/components/rootNote';
import { NoteRepostUser } from '@lume/app/note/components/user/repost';
import { NoteWrapper } from '@lume/app/note/components/wrapper';
import { getQuoteID } from '@lume/utils/transform';

export const NoteQuoteRepost = ({ event }: { event: any }) => {
  const rootID = getQuoteID(event.tags);

  return (
    <NoteWrapper href={`/app/note?id=${rootID}`} className="h-min w-full px-3 py-1.5">
      <div className="rounded-md border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
        <div className="relative px-3 pb-5 pt-3">
          <div className="absolute left-[32px] top-[20px] h-[70px] w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
          <NoteRepostUser pubkey={event.pubkey} time={event.created_at} />
        </div>
        <RootNote id={rootID} fallback={event.content} />
      </div>
    </NoteWrapper>
  );
};
