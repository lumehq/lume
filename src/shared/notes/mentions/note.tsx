import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { memo } from 'react';

import {
  MemoizedArticleKind,
  MemoizedFileKind,
  MemoizedTextKind,
  NoteSkeleton,
} from '@shared/notes';
import { User } from '@shared/user';

import { WIDGET_KIND } from '@utils/constants';
import { useEvent } from '@utils/hooks/useEvent';
import { useWidget } from '@utils/hooks/useWidget';

export const MentionNote = memo(function MentionNote({
  id,
  editing,
}: {
  id: string;
  editing?: boolean;
}) {
  const { isFetching, isError, data } = useEvent(id);
  const { addWidget } = useWidget();

  const renderKind = (event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Text:
        return <MemoizedTextKind content={event.content} textmode />;
      case NDKKind.Article:
        return <MemoizedArticleKind id={event.id} tags={event.tags} />;
      case 1063:
        return <MemoizedFileKind tags={event.tags} />;
      default:
        return null;
    }
  };

  if (isFetching) {
    return (
      <div className="w-full cursor-default rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
        <NoteSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full cursor-default rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
        Failed to fetch event
      </div>
    );
  }

  return (
    <div className="my-2 flex w-full cursor-default flex-col gap-1 rounded-lg bg-neutral-100 dark:bg-neutral-900">
      <div className="mt-3 px-3">
        <User pubkey={data.pubkey} time={data.created_at} variant="mention" />
      </div>
      <div className="mt-1 px-3 pb-3">
        {renderKind(data)}
        {!editing ? (
          <button
            type="button"
            onClick={() =>
              addWidget.mutate({
                kind: WIDGET_KIND.thread,
                title: 'Thread',
                content: data.id,
              })
            }
            className="mt-2 text-blue-500 hover:text-blue-600"
          >
            Show more
          </button>
        ) : null}
      </div>
    </div>
  );
});
