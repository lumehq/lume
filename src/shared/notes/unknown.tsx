import { NDKEvent } from '@nostr-dev-kit/ndk';

import { NoteActions } from '@shared/notes';
import { User } from '@shared/user';

export function UnknownNote({ event }: { event: NDKEvent }) {
  return (
    <div className="mb-3 h-min w-full px-3">
      <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl bg-neutral-50 pt-3 dark:bg-neutral-950">
        <User pubkey={event.pubkey} time={event.created_at} eventId={event.id} />
        <div className="rounded-lg bg-neutral-100 px-2 py-2 dark:bg-neutral-900">
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Event kind: {event.kind}
          </span>
          <p className="text-sm text-neutral-800 dark:text-neutral-200">
            Unsupported kind
          </p>
        </div>
        <div className="min-w-0 px-3">
          <div className="break-p select-text whitespace-pre-line leading-normal text-neutral-900 dark:text-neutral-100">
            {event.content.toString()}
          </div>
        </div>
        <NoteActions event={event} />
      </div>
    </div>
  );
}
