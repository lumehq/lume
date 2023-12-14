import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import Markdown from 'markdown-to-jsx';
import { nip19 } from 'nostr-tools';
import { EventPointer } from 'nostr-tools/lib/types/nip19';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeftIcon, CheckCircleIcon, ShareIcon } from '@shared/icons';
import { NoteReplyForm } from '@shared/notes';
import { ReplyList } from '@shared/notes/replies/list';
import { useEvent } from '@utils/hooks/useEvent';

export function ArticleNoteScreen() {
  const { id } = useParams();
  const { status, data } = useEvent(id);

  const [isCopy, setIsCopy] = useState(false);

  const navigate = useNavigate();
  const metadata = useMemo(() => {
    if (status === 'pending') return;

    const title = data.tags.find((tag) => tag[0] === 'title')?.[1];
    const image = data.tags.find((tag) => tag[0] === 'image')?.[1];
    const summary = data.tags.find((tag) => tag[0] === 'summary')?.[1];

    let publishedAt: Date | string | number = data.tags.find(
      (tag) => tag[0] === 'published_at'
    )?.[1];

    publishedAt = new Date(parseInt(publishedAt) * 1000).toLocaleDateString('en-US');

    return {
      title,
      image,
      publishedAt,
      summary,
    };
  }, [data]);

  const share = async () => {
    try {
      await writeText(
        'https://njump.me/' +
          nip19.neventEncode({ id: data?.id, author: data?.pubkey } as EventPointer)
      );
      // update state
      setIsCopy(true);
      // reset state after 2 sec
      setTimeout(() => setIsCopy(false), 2000);
    } catch (e) {
      toast.error(e);
    }
  };

  return (
    <div className="grid grid-cols-12 scroll-smooth px-4">
      <div className="col-span-1 flex flex-col items-start">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-900"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex h-12 w-12 items-center justify-center rounded-t-xl"
        >
          {isCopy ? (
            <CheckCircleIcon className="h-5 w-5 text-teal-500" />
          ) : (
            <ShareIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <div className="col-span-7 overflow-y-auto px-3 xl:col-span-8">
        {status === 'pending' ? (
          <div className="px-3 py-1.5">Loading...</div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 border-b border-neutral-100 pb-4 dark:border-neutral-900">
              {metadata.image && (
                <img
                  src={metadata.image}
                  alt={metadata.title}
                  className="h-auto w-full rounded-lg object-cover"
                />
              )}
              <div>
                <h1 className="mb-2 text-3xl font-semibold">{metadata.title}</h1>
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Published: {metadata.publishedAt.toString()}
                </span>
              </div>
            </div>
            <Markdown
              options={{
                overrides: {
                  a: {
                    props: {
                      className: 'text-blue-500 hover:text-blue-600',
                      target: '_blank',
                    },
                  },
                },
              }}
              className="break-p prose-lg prose-neutral dark:prose-invert prose-ul:list-disc"
            >
              {data.content}
            </Markdown>
          </div>
        )}
      </div>
      <div className="col-span-4 border-l border-neutral-100 px-3 dark:border-neutral-900 xl:col-span-3">
        <div className="mb-3 border-b border-neutral-100 pb-3 dark:border-neutral-900">
          <NoteReplyForm rootEvent={data} />
        </div>
        <ReplyList eventId={id} />
      </div>
    </div>
  );
}
