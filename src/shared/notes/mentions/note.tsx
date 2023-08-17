import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useStorage } from '@libs/storage/provider';

import { MentionUser, NoteSkeleton } from '@shared/notes';
import { User } from '@shared/user';

import { widgetKinds } from '@stores/constants';
import { useWidgets } from '@stores/widgets';

import { useEvent } from '@utils/hooks/useEvent';

export const MentionNote = memo(function MentionNote({ id }: { id: string }) {
  const { db } = useStorage();
  const { status, data } = useEvent(id);

  const setWidget = useWidgets((state) => state.setWidget);

  const openThread = (event, thread: string) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      setWidget(db, { kind: widgetKinds.thread, title: 'Thread', content: thread });
    } else {
      event.stopPropagation();
    }
  };

  if (!id) {
    return (
      <div className="mb-2 mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3">
        <p className="break-all">Failed to get event with id: {id}</p>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => openThread(e, id)}
      onKeyDown={(e) => openThread(e, id)}
      role="button"
      tabIndex={0}
      className="mb-2 mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3"
    >
      {status === 'loading' ? (
        <NoteSkeleton />
      ) : status === 'success' ? (
        <>
          <User pubkey={data.pubkey} time={data.created_at} size="small" />
          <div className="mt-2">
            <ReactMarkdown
              className="markdown"
              remarkPlugins={[remarkGfm]}
              components={{
                del: ({ children }) => {
                  const key = children[0] as string;
                  if (key.startsWith('pub')) return <MentionUser pubkey={key.slice(3)} />;
                  if (key.startsWith('tag'))
                    return (
                      <button
                        type="button"
                        className="font-normal text-orange-400 no-underline hover:text-orange-500"
                      >
                        {key.slice(3)}
                      </button>
                    );
                },
              }}
            >
              {data?.content.length > 160
                ? data.content.substring(0, 160) + '...'
                : data.content}
            </ReactMarkdown>
          </div>
        </>
      ) : (
        <p className="break-all">Failed to get event with id: {id}</p>
      )}
    </div>
  );
});
