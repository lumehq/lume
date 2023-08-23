import { NDKEvent } from '@nostr-dev-kit/ndk';

import { Image } from '@shared/image';
import { NoteActions, NoteMetadata } from '@shared/notes';
import { User } from '@shared/user';

import { isImage } from '@utils/isImage';

export function FileNote({ event }: { event: NDKEvent }) {
  const url = event.tags.find((el) => el[0] === 'url')[1];

  return (
    <div className="h-min w-full px-3 py-1.5">
      <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 pt-3">
        <div className="flex flex-col">
          <User pubkey={event.pubkey} time={event.created_at} />
          <div className="-mt-6 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="relative z-20 flex-1">
              {isImage(url) && (
                <Image
                  src={url}
                  alt="image"
                  className="h-auto w-full rounded-lg object-cover"
                />
              )}
              <NoteActions id={event.id} pubkey={event.pubkey} />
            </div>
          </div>
          <NoteMetadata id={event.id} />
        </div>
      </div>
    </div>
  );
}
