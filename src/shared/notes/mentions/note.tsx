import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { createBlock } from '@libs/storage';

import { MentionUser, NoteSkeleton } from '@shared/notes';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';

export const MentionNote = memo(function MentionNote({ id }: { id: string }) {
  const { status, data } = useEvent(id);

  const queryClient = useQueryClient();
  const block = useMutation({
    mutationFn: (data: any) => {
      return createBlock(data.kind, data.title, data.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
    },
  });

  const openThread = (event: any, thread: string) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      block.mutate({ kind: 2, title: 'Thread', content: thread });
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
              {data.content.parsed.length > 200
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
