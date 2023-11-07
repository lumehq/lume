import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { memo } from 'react';

import { PlusIcon } from '@shared/icons';
import {
  MemoizedArticleKind,
  MemoizedFileKind,
  MemoizedTextKind,
  NoteSkeleton,
} from '@shared/notes';
import { User } from '@shared/user';

import { WidgetKinds } from '@stores/constants';

import { useEvent } from '@utils/hooks/useEvent';
import { useWidget } from '@utils/hooks/useWidget';

export const MentionNote = memo(function MentionNote({ id }: { id: string }) {
  const { status, data } = useEvent(id);
  const { addWidget } = useWidget();

  const renderKind = (event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Text:
        return <MemoizedTextKind content={event.content} />;
      case NDKKind.Article:
        return <MemoizedArticleKind id={event.id} tags={event.tags} />;
      case 1063:
        return <MemoizedFileKind tags={event.tags} />;
      default:
        return null;
    }
  };

  if (status === 'pending') {
    return (
      <div className="w-full cursor-default rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
        <NoteSkeleton />
      </div>
    );
  }

  return (
    <div className="my-2 flex w-full cursor-default flex-col gap-1 rounded-lg bg-neutral-100 dark:bg-neutral-900">
      <div className="px-3 pt-3">
        <User pubkey={data.pubkey} time={data.created_at} variant="mention" />
      </div>
      <div>{renderKind(data)}</div>
    </div>
  );
});
