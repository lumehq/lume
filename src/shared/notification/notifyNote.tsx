import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';

import { useStorage } from '@libs/storage/provider';

import {
  ArticleNote,
  FileNote,
  NoteSkeleton,
  TextNote,
  UnknownNote,
} from '@shared/notes';
import { User } from '@shared/user';

import { WidgetKinds, useWidgets } from '@stores/widgets';

import { formatCreatedAt } from '@utils/createdAt';
import { useEvent } from '@utils/hooks/useEvent';

export function NotifyNote({ event }: { event: NDKEvent }) {
  const createdAt = formatCreatedAt(event.created_at, false);
  const rootEventId = event.tags.find((el) => el[0] === 'e')?.[1];

  const { db } = useStorage();
  const { status, data } = useEvent(rootEventId);

  const setWidget = useWidgets((state) => state.setWidget);

  const openThread = (event, thread: string) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      setWidget(db, { kind: WidgetKinds.local.thread, title: 'Thread', content: thread });
    } else {
      event.stopPropagation();
    }
  };

  const renderKind = (event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Text:
        return <TextNote content={event.content} />;
      case NDKKind.Article:
        return <ArticleNote event={event} />;
      case 1063:
        return <FileNote event={event} />;
      default:
        return <UnknownNote event={event} />;
    }
  };

  const renderText = (kind: number) => {
    switch (kind) {
      case NDKKind.Text:
        return 'replied';
      case NDKKind.Reaction:
        return `reacted ${event.content}`;
      case NDKKind.Repost:
        return 'reposted';
      case NDKKind.Zap:
        return 'zapped';
      default:
        return 'Unknown';
    }
  };

  if (status === 'loading') {
    return (
      <div className="h-min w-full px-3 pb-3">
        <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
          <NoteSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-min w-full px-3 pb-3">
      <div className="flex flex-col gap-2 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <User pubkey={event.pubkey} variant="notify" />
              <p className="font-medium text-neutral-600 dark:text-neutral-400">
                {renderText(event.kind)}
              </p>
            </div>
            <span className="text-neutral-500 dark:text-neutral-400">{createdAt}</span>
          </div>
          {event.kind === 1 ? <TextNote content={event.content} /> : null}
        </div>
        <div
          onClick={(e) => openThread(e, data.id)}
          onKeyDown={(e) => openThread(e, data.id)}
          role="button"
          tabIndex={0}
          className="cursor-default rounded-lg border border-neutral-300 bg-neutral-200 p-3 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <User pubkey={data.pubkey} time={data.created_at} variant="mention" />
          <div className="mt-1">{renderKind(data)}</div>
        </div>
      </div>
    </div>
  );
}
