import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import {
  ArticleNote,
  FileNote,
  LinkPreview,
  NoteActions,
  NoteSkeleton,
  RepostUser,
  TextNote,
  UnknownNote,
} from '@shared/notes';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';

export function Repost({ event, root }: { event: NDKEvent; root?: string }) {
  const rootPost = root ?? event.tags.find((el) => el[0] === 'e')?.[1];
  const { status, data } = useEvent(rootPost, event.content);

  const renderKind = useCallback(
    (repostEvent: NDKEvent) => {
      switch (repostEvent.kind) {
        case NDKKind.Text:
          return <TextNote content={repostEvent.content} />;
        case NDKKind.Article:
          return <ArticleNote event={repostEvent} />;
        case 1063:
          return <FileNote event={repostEvent} />;
        default:
          return <UnknownNote event={repostEvent} />;
      }
    },
    [data]
  );

  if (status === 'loading') {
    return (
      <div className="h-min w-full px-3 pb-3">
        <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
          <NoteSkeleton />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    // @ts-expect-error, root_id isn't exist on NDKEvent
    const noteLink = `https://nostr.com/${nip19.noteEncode(event.root_id)}`;
    return (
      <div className="relative mb-5 flex flex-col">
        <div className="relative z-10 flex items-start gap-3">
          <div className="inline-flex h-11 w-11 items-end justify-center rounded-lg bg-black pb-1">
            <img src="/lume.png" alt="lume" className="h-auto w-1/3" />
          </div>
          <h5 className="truncate font-semibold leading-none text-white">
            Lume <span className="text-green-500">(System)</span>
          </h5>
        </div>
        <div className="-mt-6 flex items-start gap-3">
          <div className="w-11 shrink-0" />
          <div>
            <div className="relative z-20 mt-1 flex-1 select-text">
              <div className="mb-1 select-text rounded-lg bg-white/5 p-1.5 text-sm">
                Lume cannot find this post with your current relays, but you can view it
                via nostr.com.{' '}
                <Link to={noteLink} className="text-fuchsia-500">
                  Learn more
                </Link>
              </div>
            </div>
            <LinkPreview urls={[noteLink]} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-min w-full px-3 pb-3">
      <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
        <div className="relative flex flex-col">
          <div className="isolate flex flex-col -space-y-4">
            <RepostUser pubkey={event.pubkey} />
            <User pubkey={data.pubkey} time={data.created_at} isRepost={true} />
          </div>
          <div className="-mt-2 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="relative z-20 flex-1">
              {renderKind(data)}
              <NoteActions id={data.id} pubkey={data.pubkey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
