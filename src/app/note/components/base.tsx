import { Kind1 } from '@lume/app/note/components/kind1';
import { Kind1063 } from '@lume/app/note/components/kind1063';
import NoteMetadata from '@lume/app/note/components/metadata';
import { NoteParent } from '@lume/app/note/components/parent';
import { NoteDefaultUser } from '@lume/app/note/components/user/default';
import { NoteWrapper } from '@lume/app/note/components/wrapper';
import { noteParser } from '@lume/utils/parser';
import { isTagsIncludeID } from '@lume/utils/transform';

import { useMemo } from 'react';

export const NoteBase = ({ event }: { event: any }) => {
  const content = useMemo(() => noteParser(event), [event]);
  const checkParentID = isTagsIncludeID(event.parent_id, event.tags);

  const href = event.parent_id ? `/app/note?id=${event.parent_id}` : `/app/note?id=${event.event_id}`;

  return (
    <NoteWrapper href={href} className="h-min w-full px-3 py-1.5">
      <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 pt-3 shadow-input shadow-black/20">
        {event.parent_id && (event.parent_id !== event.event_id || checkParentID) ? (
          <NoteParent id={event.parent_id} />
        ) : (
          <></>
        )}
        <div className="flex flex-col">
          <NoteDefaultUser pubkey={event.pubkey} time={event.created_at} />
          <div className="mt-3 pl-[46px]">
            {event.kind === 1 && <Kind1 content={content} />}
            {event.kind === 1063 && <Kind1063 metadata={event.tags} />}
            <NoteMetadata id={event.event_id} eventPubkey={event.pubkey} />
          </div>
        </div>
      </div>
    </NoteWrapper>
  );
};
