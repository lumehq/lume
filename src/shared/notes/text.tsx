import { NDKEvent } from '@nostr-dev-kit/ndk';
import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

import { useArk } from '@libs/ark';

import { ChildNote, NoteActions } from '@shared/notes';
import { User } from '@shared/user';

import { WIDGET_KIND } from '@utils/constants';
import { useRichContent } from '@utils/hooks/useRichContent';
import { useWidget } from '@utils/hooks/useWidget';

export function TextNote({ event, className }: { event: NDKEvent; className?: string }) {
  const { parsedContent } = useRichContent(event.content);
  const { addWidget } = useWidget();
  const { ark } = useArk();

  const thread = ark.getEventThread({ tags: event.tags });

  return (
    <div className={twMerge('mb-3 h-min w-full px-3', className)}>
      <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl bg-neutral-50 pt-3 dark:bg-neutral-950">
        <User pubkey={event.pubkey} time={event.created_at} eventId={event.id} />
        {thread ? (
          <div className="w-full px-3">
            <div className="flex h-min w-full flex-col gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
              {thread.rootEventId ? <ChildNote id={thread.rootEventId} isRoot /> : null}
              {thread.replyEventId ? <ChildNote id={thread.replyEventId} /> : null}
              <button
                type="button"
                onClick={() =>
                  addWidget.mutate({
                    kind: WIDGET_KIND.thread,
                    title: 'Thread',
                    content: thread.rootEventId,
                  })
                }
                className="self-start text-blue-500 hover:text-blue-600"
              >
                Show full thread
              </button>
            </div>
          </div>
        ) : null}
        <div className="min-w-0 px-3">
          <div className="break-p select-text whitespace-pre-line leading-normal text-neutral-900 dark:text-neutral-100">
            {parsedContent}
          </div>
        </div>
        <NoteActions event={event} rootEventId={thread?.rootEventId} />
      </div>
    </div>
  );
}

export const MemoizedTextNote = memo(TextNote);
