import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { memo } from 'react';

import { useArk } from '@libs/ark';

import { ReplyIcon, RepostIcon } from '@shared/icons';
import { ChildNote, TextKind } from '@shared/notes';
import { User } from '@shared/user';

import { WIDGET_KIND } from '@utils/constants';
import { formatCreatedAt } from '@utils/formater';
import { useWidget } from '@utils/hooks/useWidget';

export function NotifyNote({ event }: { event: NDKEvent }) {
  const { ark } = useArk();
  const { addWidget } = useWidget();

  const thread = ark.getEventThread({ tags: event.tags });
  const createdAt = formatCreatedAt(event.created_at, false);

  if (event.kind === NDKKind.Reaction) {
    return (
      <div className="mb-3 h-min w-full px-3">
        <div className="flex flex-col gap-2 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-950">
          <div className="flex h-10 items-center justify-between">
            <div className="relative flex w-full items-center gap-2 px-3 pt-2">
              <div className="absolute -left-0.5 -top-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-xs ring-2 ring-neutral-50 dark:bg-blue-900 dark:ring-neutral-950">
                {event.content === '+' ? '👍' : event.content}
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div className="inline-flex items-center gap-1.5">
                  <User pubkey={event.pubkey} variant="notify" />
                  <p className="text-neutral-700 dark:text-neutral-300">reacted</p>
                </div>
                <div className="text-neutral-500 dark:text-neutral-400">{createdAt}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full px-3">
              <div className="flex h-min w-full flex-col gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
                {thread.rootEventId ? <ChildNote id={thread.rootEventId} /> : null}
              </div>
            </div>
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
              Show original post
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (event.kind === NDKKind.Repost) {
    return (
      <div className="mb-3 h-min w-full px-3">
        <div className="flex flex-col gap-2 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-950">
          <div className="flex h-10 items-center justify-between">
            <div className="relative flex w-full items-center gap-2 px-3 pt-2">
              <div className="absolute -left-0.5 -top-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-500 text-xs ring-2 ring-neutral-50 dark:ring-neutral-950">
                <RepostIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div className="inline-flex items-center gap-1.5">
                  <User pubkey={event.pubkey} variant="notify" />
                  <p className="text-neutral-700 dark:text-neutral-300">reposted</p>
                </div>
                <div className="text-neutral-500 dark:text-neutral-400">{createdAt}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full px-3">
              <div className="flex h-min w-full flex-col gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
                {thread.rootEventId ? <ChildNote id={thread.rootEventId} /> : null}
              </div>
            </div>
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
              Show original post
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (event.kind === NDKKind.Text) {
    return (
      <div className="mb-3 h-min w-full px-3">
        <div className="flex flex-col gap-2 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-950">
          <div className="flex h-10 items-center justify-between">
            <div className="relative flex w-full items-center gap-2 px-3 pt-2">
              <div className="absolute -left-0.5 -top-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-500 text-xs ring-2 ring-neutral-50 dark:ring-neutral-950">
                <ReplyIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div className="inline-flex items-center gap-1.5">
                  <User pubkey={event.pubkey} variant="notify" />
                  <p className="text-neutral-700 dark:text-neutral-300">replied</p>
                </div>
                <div className="text-neutral-500 dark:text-neutral-400">{createdAt}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full px-3">
              <div className="flex h-min w-full flex-col gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
                {thread?.replyEventId ? (
                  <ChildNote id={thread?.replyEventId} />
                ) : thread?.rootEventId ? (
                  <ChildNote id={thread?.rootEventId} isRoot />
                ) : null}
                <button
                  type="button"
                  onClick={() =>
                    addWidget.mutate({
                      kind: WIDGET_KIND.thread,
                      title: 'Thread',
                      content: thread.replyEventId
                        ? thread.replyEventId
                        : thread.rootEventId,
                    })
                  }
                  className="self-start text-blue-500 hover:text-blue-600"
                >
                  Show full thread
                </button>
              </div>
            </div>
            <TextKind content={event.content} textmode />
          </div>
        </div>
      </div>
    );
  }
}

export const MemoizedNotifyNote = memo(NotifyNote);
