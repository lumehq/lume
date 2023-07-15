import { useMemo } from 'react';

import {
  LinkPreview,
  NoteActions,
  NoteMetadata,
  SubNote,
  VideoPreview,
} from '@shared/notes';
import { MentionNote } from '@shared/notes/mentions/note';
import { ImagePreview } from '@shared/notes/preview/image';
import { User } from '@shared/user';

import { parser } from '@utils/parser';
import { LumeEvent } from '@utils/types';

export function NoteThread({
  event,
  root,
  reply,
}: {
  event: LumeEvent;
  root: string;
  reply: string;
}) {
  const content = useMemo(() => parser(event), [event.id]);

  return (
    <div className="h-min w-full px-3 py-1.5">
      <div className="overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 pt-3">
        <div className="relative">{root && <SubNote id={root} />}</div>
        <div className="relative">{reply && <SubNote id={reply} />}</div>
        <div className="relative flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} />
          <div className="relative z-20 -mt-5 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="flex-1">
              <div className="relative z-10 select-text whitespace-pre-line break-words text-base text-zinc-100">
                {content.parsed}
              </div>
              {content.images.length > 0 && <ImagePreview urls={content.images} />}
              {content.videos.length > 0 && <VideoPreview urls={content.videos} />}
              {content.links.length > 0 && <LinkPreview urls={content.links} />}
              {content.notes.length > 0 &&
                content.notes.map((note: string) => <MentionNote key={note} id={note} />)}
              <NoteActions
                id={event.event_id}
                rootID={event.parent_id}
                eventPubkey={event.pubkey}
              />
            </div>
          </div>
          <NoteMetadata id={event.event_id} />
        </div>
      </div>
    </div>
  );
}
