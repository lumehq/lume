import { Image } from '@shared/image';
import { NoteActions, NoteMetadata } from '@shared/notes';
import { User } from '@shared/user';

import { LumeEvent } from '@utils/types';

function isImage(url: string) {
  return /\.(jpg|jpeg|gif|png|webp|avif)$/.test(url);
}

export function NoteKind_1063({ event }: { event: LumeEvent }) {
  const url = event.tags[0][1];

  return (
    <div className="h-min w-full px-3 py-1.5">
      <div className="relative overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 pt-3">
        <div className="flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} />
          <div className="relative z-20 -mt-5 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="flex-1">
              {isImage(url) && (
                <Image
                  src={url}
                  fallback="https://void.cat/d/XTmrMkpid8DGLjv1AzdvcW"
                  alt="image"
                  className="h-auto w-full rounded-lg object-cover"
                />
              )}
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
