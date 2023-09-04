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

  if (status === 'loading') {
    return (
      <div className="mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3 backdrop-blur-xl">
        <NoteSkeleton />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3 backdrop-blur-xl">
        <h5 className="mb-1 text-sm font-medium text-red-500">Event not found</h5>
        <div className="select-text break-all rounded border border-dashed border-red-500 p-2 text-red-500">
          {id}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => openThread(e, id)}
      onKeyDown={(e) => openThread(e, id)}
      role="button"
      tabIndex={0}
      className="mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3 backdrop-blur-xl"
    >
      <User pubkey={data.pubkey} time={data.created_at} size="small" />
      <div className="mt-1">{renderKind(data)}</div>
    </div>
  );
});
