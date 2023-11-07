import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { memo } from 'react';

import { ShareIcon } from '@shared/icons';
import { MemoizedArticleKind, MemoizedFileKind, NoteSkeleton } from '@shared/notes';
import { User } from '@shared/user';

import { WidgetKinds } from '@stores/constants';

import { formatCreatedAt } from '@utils/createdAt';
import { useEvent } from '@utils/hooks/useEvent';
import { useWidget } from '@utils/hooks/useWidget';

export function NotifyNote({ event }: { event: NDKEvent }) {
  const createdAt = formatCreatedAt(event.created_at, false);
  const rootEventId = event.tags.find((el) => el[0] === 'e')?.[1];

  const { status, data } = useEvent(rootEventId);
  const { addWidget } = useWidget();

  const renderKind = (event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Text:
        return (
          <div className="break-p line-clamp-3 select-text leading-normal text-neutral-900 dark:text-neutral-100">
            {event.content}
          </div>
        );
      case NDKKind.Article:
        return <MemoizedArticleKind key={event.id} id={event.id} tags={event.tags} />;
      case 1063:
        return <MemoizedFileKind key={event.id} tags={event.tags} />;
      default:
        return (
          <div className="break-p line-clamp-3 select-text leading-normal text-neutral-900 dark:text-neutral-100">
            {event.content}
          </div>
        );
    }
  };

  const renderText = (kind: number) => {
    switch (kind) {
      case NDKKind.Text:
        return 'replied';
      case NDKKind.Reaction: {
        return `reacted your post`;
      }
      case NDKKind.Repost:
        return 'reposted your post';
      case NDKKind.Zap:
        return 'zapped your post';
      default:
        return 'unknown';
    }
  };

  if (status === 'pending') {
    return (
      <div className="h-min w-full px-3 pb-3">
        <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
          <NoteSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 h-min w-full px-3">
      <div className="flex flex-col gap-2 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-950">
        <div className="flex h-10 items-center justify-between">
          <div className="relative flex w-full items-center gap-2 px-3 pt-2">
            <div className="absolute -left-0.5 -top-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-xs ring-2 ring-neutral-50 dark:bg-blue-900 dark:ring-neutral-950">
              {event.kind === 7 ? (event.content === '+' ? '👍' : event.content) : '⚡️'}
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div className="inline-flex items-center gap-1.5">
                <User pubkey={event.pubkey} variant="notify" />
                <p className="text-neutral-900 dark:text-neutral-100">
                  {renderText(event.kind)}
                </p>
              </div>
              <div className="text-neutral-500 dark:text-neutral-400">{createdAt}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">{renderKind(data)}</div>
          <button
            type="button"
            onClick={() =>
              addWidget.mutate({
                kind: WidgetKinds.local.thread,
                title: 'Thread',
                content: data.id,
              })
            }
            className="inline-flex min-h-full w-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:text-blue-500 dark:text-neutral-400"
          >
            <ShareIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export const MemoizedNotifyNote = memo(NotifyNote);
