import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { MentionUser, NoteSkeleton } from '@shared/notes';
import { User } from '@shared/user';

import { BLOCK_KINDS } from '@stores/constants';

import { useBlock } from '@utils/hooks/useBlock';
import { useEvent } from '@utils/hooks/useEvent';

export const MentionNote = memo(function MentionNote({ id }: { id: string }) {
  const { add } = useBlock();
  const { status, data } = useEvent(id);

  const openThread = (event, thread: string) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      add.mutate({ kind: BLOCK_KINDS.thread, title: 'Thread', content: thread });
    } else {
      event.stopPropagation();
    }
  };

  return (
    <div
      onClick={(e) => openThread(e, id)}
      onKeyDown={(e) => openThread(e, id)}
      role="button"
      tabIndex={0}
      className="mt-3 rounded-lg border-t border-zinc-700/50 bg-zinc-800/50 px-3 py-3"
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
              {data?.content?.parsed?.length > 200
                ? data.content.parsed.substring(0, 200) + '...'
                : data.content.parsed}
            </ReactMarkdown>
          </div>
        </>
      ) : (
        <p>Failed to fetch event</p>
      )}
    </div>
  );
});
