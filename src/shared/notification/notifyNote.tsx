import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';

import {
  ArticleNote,
  FileNote,
  NoteActions,
  NoteSkeleton,
  TextNote,
  UnknownNote,
} from '@shared/notes';
import { User } from '@shared/user';

import { formatCreatedAt } from '@utils/createdAt';
import { useEvent } from '@utils/hooks/useEvent';

export function NotifyNote({
  id,
  user,
  content,
  kind,
  time,
}: {
  id: string;
  user: string;
  content: string;
  kind: NDKKind | number;
  time: number;
}) {
  const createdAt = formatCreatedAt(time, false);
  const { status, data } = useEvent(id);

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
        return `reacted ${content}`;
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
    <div className="mb-5 flex h-min w-full flex-col gap-2 px-3 pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <User pubkey={user} variant="notify" />
          <p className="font-medium text-neutral-600 dark:text-neutral-400">
            {renderText(kind)}
          </p>
        </div>
        <span className="font-medium text-neutral-600 dark:text-neutral-400">
          {createdAt}
        </span>
      </div>
      <div className="relative overflow-hidden rounded-xl bg-neutral-100 px-3 py-4 dark:bg-neutral-900">
        <div className="relative flex flex-col">
          <User pubkey={data.pubkey} time={data.created_at} eventId={data.id} />
          <div className="-mt-4 flex items-start gap-3">
            <div className="w-10 shrink-0" />
            <div className="relative z-20 flex-1">
              {renderKind(data)}
              <NoteActions id={data.id} pubkey={data.pubkey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
