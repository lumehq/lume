import { memo } from 'react';

import { useStorage } from '@libs/storage/provider';

import { NoteSkeleton } from '@shared/notes';
import { User } from '@shared/user';

import { WidgetKinds, useWidgets } from '@stores/widgets';

import { useEvent } from '@utils/hooks/useEvent';

export const SimpleNote = memo(function SimpleNote({ id }: { id: string }) {
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
      <div className="mb-2 mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3 backdrop-blur-xl">
        <NoteSkeleton />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mb-2 mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3 backdrop-blur-xl">
        <p>Can&apos;t get event from relay</p>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => openThread(e, id)}
      onKeyDown={(e) => openThread(e, id)}
      role="button"
      tabIndex={0}
      className="mb-2 mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3 backdrop-blur-xl"
    >
      <User pubkey={data.pubkey} time={data.created_at} size="small" />
      <div className="markdown">
        <p>
          {data.content.length > 200
            ? data.content.substring(0, 200) + '...'
            : data.content}
        </p>
      </div>
    </div>
  );
});
