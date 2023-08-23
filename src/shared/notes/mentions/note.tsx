import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { memo } from 'react';

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

import { useEvent } from '@utils/hooks/useEvent';

export const MentionNote = memo(function MentionNote({ id }: { id: string }) {
  const { db } = useStorage();
  const { status, data } = useEvent(id);

  const setWidget = useWidgets((state) => state.setWidget);

  const openThread = (event, thread: string) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      setWidget(db, { kind: WidgetKinds.thread, title: 'Thread', content: thread });
    } else {
      event.stopPropagation();
    }
  };

  if (status === 'loading') {
    return (
      <div className="mb-2 mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3">
        <NoteSkeleton />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mb-2 mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3">
        <p>Can&apos;t get event from relay</p>
      </div>
    );
  }

  const renderKind = (event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Text:
        return <TextNote event={event} />;
      case NDKKind.Article:
        return <ArticleNote event={event} />;
      case 1063:
        return <FileNote event={event} />;
      default:
        return <UnknownNote event={event} />;
    }
  };

  return (
    <div
      onClick={(e) => openThread(e, id)}
      onKeyDown={(e) => openThread(e, id)}
      role="button"
      tabIndex={0}
      className="mb-2 mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3"
    >
      <User pubkey={data.pubkey} time={data.created_at} size="small" />
      <div>{renderKind(data)}</div>
    </div>
  );
});
