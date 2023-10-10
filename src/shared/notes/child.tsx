import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import { Link } from 'react-router-dom';

import {
  ArticleNote,
  FileNote,
  LinkPreview,
  NoteActions,
  NoteSkeleton,
  TextNote,
  UnknownNote,
} from '@shared/notes';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';

export function ChildNote({ id, root }: { id: string; root?: string }) {
  const { status, data } = useEvent(id);

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
      <>
        <div className="absolute bottom-0 left-[18px] h-[calc(100%-3.4rem)] w-0.5 bg-gradient-to-t from-black/20 to-black/10 dark:from-white/20 dark:to-white/10" />
        <div className="relative mb-5 overflow-hidden">
          <NoteSkeleton />
        </div>
      </>
    );
  }

  if (status === 'error') {
    const noteLink = `https://njump.me/${nip19.noteEncode(id)}`;
    return (
      <>
        <div className="absolute bottom-0 left-[18px] h-[calc(100%-3.4rem)] w-0.5 bg-gradient-to-t from-black/20 to-black/10 dark:from-white/20 dark:to-white/10" />
        <div className="relative mb-5 flex flex-col">
          <div className="relative z-10 flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-end justify-center rounded-lg bg-black pb-1">
              <img src="/lume.png" alt="lume" className="h-auto w-1/3" />
            </div>
            <h5 className="truncate font-semibold leading-none text-white">
              Lume <span className="text-green-500">(System)</span>
            </h5>
          </div>
          <div className="-mt-3 flex items-start gap-3">
            <div className="w-10 shrink-0" />
            <div>
              <div className="relative z-20 mt-1 flex-1 select-text">
                <div className="mb-1 select-text rounded-lg bg-white/5 p-1.5 text-sm">
                  Lume cannot find this post with your current relays, but you can view it
                  via njump.me.{' '}
                  <Link to={noteLink} className="text-blue-500">
                    Learn more
                  </Link>
                </div>
              </div>
              <LinkPreview urls={[noteLink]} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="absolute bottom-0 left-[18px] h-[calc(100%-3.6rem)] w-0.5 bg-gradient-to-t from-black/20 to-black/10 dark:from-white/20 dark:to-white/10" />
      <div className="mb-5 flex flex-col">
        <User pubkey={data.pubkey} time={data.created_at} />
        <div className="-mt-3 flex items-start gap-3">
          <div className="w-10 shrink-0" />
          <div className="relative z-20 flex-1">
            {renderKind(data)}
            <NoteActions id={data.id} pubkey={data.pubkey} root={root} />
          </div>
        </div>
      </div>
    </>
  );
}
