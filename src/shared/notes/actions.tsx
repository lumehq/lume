import { NDKEvent } from '@nostr-dev-kit/ndk';
import * as Tooltip from '@radix-ui/react-tooltip';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { FocusIcon, ReplyIcon } from '@shared/icons';
import { NoteReaction } from '@shared/notes/actions/reaction';
import { NoteRepost } from '@shared/notes/actions/repost';
import { NoteZap } from '@shared/notes/actions/zap';

import { WIDGET_KIND } from '@utils/constants';
import { useWidget } from '@utils/hooks/useWidget';

export function NoteActions({
  event,
  rootEventId,
  canOpenEvent = true,
}: {
  event: NDKEvent;
  rootEventId?: string;
  canOpenEvent?: boolean;
}) {
  const { addWidget } = useWidget();
  const navigate = useNavigate();

  return (
    <Tooltip.Provider>
      <div className="flex h-14 items-center justify-between px-3">
        {canOpenEvent && (
          <div className="inline-flex items-center gap-3">
            <Tooltip.Root delayDuration={150}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  onClick={() =>
                    addWidget.mutate({
                      kind: WIDGET_KIND.thread,
                      title: 'Thread',
                      content: event.id,
                    })
                  }
                  className="inline-flex h-7 w-max items-center justify-center gap-2 rounded-full bg-neutral-100 px-2 text-sm font-medium dark:bg-neutral-900"
                >
                  <FocusIcon className="h-4 w-4" />
                  Open
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="-left-10 inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-200 px-3.5 text-sm text-neutral-900 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-800 dark:text-neutral-100">
                  Open thread
                  <Tooltip.Arrow className="fill-neutral-200 dark:fill-neutral-800" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        )}
        <div className="inline-flex items-center gap-10">
          <Tooltip.Root delayDuration={150}>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                onClick={() =>
                  navigate({
                    pathname: '/new/',
                    search: createSearchParams({
                      replyTo: event.id,
                      rootReplyTo: rootEventId,
                    }).toString(),
                  })
                }
                className="group inline-flex h-7 w-7 items-center justify-center text-neutral-600 dark:text-neutral-400"
              >
                <ReplyIcon className="h-5 w-5 group-hover:text-blue-500" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="-left-10 inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-200 px-3.5 text-sm text-neutral-900 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-800 dark:text-neutral-100">
                Quick reply
                <Tooltip.Arrow className="fill-neutral-200 dark:fill-neutral-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <NoteReaction event={event} />
          <NoteRepost event={event} />
          <NoteZap event={event} />
        </div>
      </div>
    </Tooltip.Provider>
  );
}
