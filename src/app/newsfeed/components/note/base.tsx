import { contentParser } from '@lume/app/newsfeed/components/contentParser';
import NoteMetadata from '@lume/app/newsfeed/components/note/metadata';
import { NoteParent } from '@lume/app/newsfeed/components/note/parent';
import { NoteDefaultUser } from '@lume/app/newsfeed/components/user/default';

import { navigate } from 'vite-plugin-ssr/client/router';

export default function NoteBase({ event }: { event: any }) {
  const content = contentParser(event.content, event.tags);

  const parentNote = () => {
    if (event.parent_id) {
      if (event.parent_id !== event.event_id && !event.content.includes('#[0]')) {
        return <NoteParent key={event.parent_id} id={event.parent_id} />;
      }
    }
    return <></>;
  };

  const openNote = (e) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      navigate(`/app/note?id=${event.parent_id}`);
    } else {
      e.stopPropagation();
    }
  };

  return (
    <div
      onClick={(e) => openNote(e)}
      className="relative z-10 flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 px-3 py-5 hover:bg-black/20"
    >
      {parentNote()}
      <div className="relative z-10 flex flex-col">
        <NoteDefaultUser pubkey={event.pubkey} time={event.created_at} />
        <div className="mt-1 pl-[52px]">
          <div className="whitespace-pre-line break-words text-[15px] leading-tight text-zinc-100">{content}</div>
        </div>
        <div onClick={(e) => e.stopPropagation()} className="mt-5 pl-[52px]">
          <NoteMetadata id={event.event_id} eventPubkey={event.pubkey} />
        </div>
      </div>
    </div>
  );
}
