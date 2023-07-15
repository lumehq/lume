import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  ImagePreview,
  LinkPreview,
  MentionNote,
  MentionUser,
  NoteActions,
  NoteSkeleton,
  VideoPreview,
} from '@shared/notes';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';

export function SubNote({ id }: { id: string }) {
  const { status, data } = useEvent(id);

  if (status === 'loading') {
    return (
      <div className="relative overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 pt-3">
        <NoteSkeleton />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 py-3">
        <p className="text-zinc-400">Failed to fetch</p>
      </div>
    );
  }

  return (
    <>
      <div className="absolute bottom-0 left-[18px] h-[calc(100%-3.4rem)] w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600" />
      <div className="mb-5 flex flex-col">
        <User pubkey={data.pubkey} time={data.created_at} />
        <div className="relative z-20 -mt-5 flex items-start gap-3">
          <div className="w-11 shrink-0" />
          <div className="flex-1">
            <ReactMarkdown
              className="markdown"
              remarkPlugins={[remarkGfm]}
              components={{
                del: ({ children }) => {
                  const pubkey = children[0] as string;
                  return <MentionUser pubkey={pubkey.slice(3)} />;
                },
              }}
            >
              {data.content.parsed}
            </ReactMarkdown>
            {data.content.images.length > 0 && (
              <ImagePreview urls={data.content.images} />
            )}
            {data.content.videos.length > 0 && (
              <VideoPreview urls={data.content.videos} />
            )}
            {data.content.links.length > 0 && <LinkPreview urls={data.content.links} />}
            {data.content.notes.length > 0 &&
              data.content.notes.map((note: string) => (
                <MentionNote key={note} id={note} />
              ))}
            <NoteActions id={data.id} eventPubkey={data.pubkey} />
          </div>
        </div>
      </div>
    </>
  );
}
