import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  ImagePreview,
  LinkPreview,
  MentionNote,
  MentionUser,
  NoteActions,
  NoteMetadata,
  NoteSkeleton,
  RepostUser,
  VideoPreview,
} from '@shared/notes';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';
import { getRepostID } from '@utils/transform';
import { LumeEvent } from '@utils/types';

export function Repost({ event }: { event: LumeEvent }) {
  const repostID = getRepostID(event.tags);
  const { status, data } = useEvent(repostID, event.content);

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
    <div className="h-min w-full px-3 py-1.5">
      <div className="relative overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 pt-3">
        <div className="flex flex-col">
          <div className="isolate flex flex-col -space-y-4 overflow-hidden">
            <RepostUser pubkey={event.pubkey} />
            <User pubkey={data.pubkey} time={event.created_at} isRepost={true} />
          </div>
          <div className="relative z-20 flex items-start gap-3">
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
              <NoteActions
                id={event.event_id}
                rootID={event.parent_id}
                eventPubkey={event.pubkey}
              />
            </div>
          </div>
          <NoteMetadata id={event.event_id} />
        </div>
      </div>
    </div>
  );
}
