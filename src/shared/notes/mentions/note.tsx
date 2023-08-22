import { memo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useStorage } from '@libs/storage/provider';

import { Image } from '@shared/image';
import { MentionUser, NoteSkeleton } from '@shared/notes';
import { User } from '@shared/user';

import { WidgetKinds, useWidgets } from '@stores/widgets';

import { useEvent } from '@utils/hooks/useEvent';
import { isImage } from '@utils/isImage';

export const MentionNote = memo(function MentionNote({ id }: { id: string }) {
  const { db } = useStorage();
  const { status, data, error } = useEvent(id);

  const setWidget = useWidgets((state) => state.setWidget);

  const openThread = (event, thread: string) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      setWidget(db, { kind: WidgetKinds.thread, title: 'Thread', content: thread });
    } else {
      event.stopPropagation();
    }
  };

  const renderItem = useCallback(() => {
    if (!data) return;
    switch (data.event.kind) {
      case 1: {
        return (
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
            {data.richContent.parsed.length > 160
              ? data.richContent.parsed.substring(0, 160) + '...'
              : data.richContent.parsed}
          </ReactMarkdown>
        );
      }
      case 1063: {
        const url = data.event.tags.find((el) => el[0] === 'url')[1];
        return (
          <div>
            {isImage(url) && (
              <Image
                src={url}
                alt="image"
                className="h-auto w-full rounded-lg object-cover"
              />
            )}
          </div>
        );
      }
      default:
        break;
    }
  }, [data]);

  if (status === 'loading') {
    return (
      <div className="mb-2 mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3">
        <NoteSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-2 mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3">
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
      className="mb-2 mt-3 cursor-default rounded-lg bg-white/10 px-3 py-3"
    >
      <User pubkey={data.event.pubkey} time={data.event.created_at} size="small" />
      <div className="mt-2">{renderItem()}</div>
    </div>
  );
});
