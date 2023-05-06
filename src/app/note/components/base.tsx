import { NoteContent } from '@lume/app/note/components/content';
import NoteMetadata from '@lume/app/note/components/metadata';
import { NoteParent } from '@lume/app/note/components/parent';
import { NoteDefaultUser } from '@lume/app/note/components/user/default';
import { noteParser } from '@lume/utils/parser';

import { navigate } from 'vite-plugin-ssr/client/router';

export default function NoteBase({ event }: { event: any }) {
  const content = noteParser(event);

  const openNote = (e) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      navigate(`/app/note?id=${event.parent_id}`);
    } else {
      e.stopPropagation();
    }
  };

  return (
    <div onClick={(e) => openNote(e)} className="h-min w-full select-text px-3 py-1.5">
      <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 pt-3 shadow-input shadow-black/20">
        {event.parent_id && event.parent_id !== event.event_id && (
          <NoteParent key={event.parent_id} id={event.parent_id} />
        )}
        <div className="flex flex-col">
          <NoteDefaultUser pubkey={event.pubkey} time={event.created_at} />
          <div className="mt-1 pl-[52px]">
            <NoteContent content={content} />
            <NoteMetadata id={event.event_id} eventPubkey={event.pubkey} />
          </div>
        </div>
      </div>
    </div>
  );
}
