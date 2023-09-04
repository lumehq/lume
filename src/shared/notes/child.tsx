import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';

import {
  ArticleNote,
  FileNote,
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
        <div className="absolute bottom-0 left-[18px] h-[calc(100%-3.4rem)] w-0.5 bg-gradient-to-t from-white/20 to-white/10" />
        <div className="relative mb-5 overflow-hidden">
          <NoteSkeleton />
        </div>
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <div className="absolute bottom-0 left-[18px] h-[calc(100%-3.4rem)] w-0.5 bg-gradient-to-t from-white/20 to-white/10" />
        <div className="relative mb-5 flex flex-col">
          <div className="relative z-10 flex items-start gap-3">
            <div className="h-11 w-11 rounded-lg bg-black" />
            <h5 className="truncate font-semibold leading-none text-white">
              Lume (System)
            </h5>
          </div>
          <div className="-mt-6 flex items-start gap-3">
            <div className="w-11 shrink-0" />
            <div className="markdown relative z-20 flex-1 select-text">
              <p>Event not found, click to open this note via nostr.com</p>
              <p>{id}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="absolute bottom-0 left-[18px] h-[calc(100%-3.4rem)] w-0.5 bg-gradient-to-t from-white/20 to-white/10" />
      <div className="mb-5 flex flex-col">
        <User pubkey={data.pubkey} time={data.created_at} />
        <div className="-mt-6 flex items-start gap-3">
          <div className="w-11 shrink-0" />
          <div className="relative z-20 flex-1">
            {renderKind(data)}
            <NoteActions id={data.id} pubkey={data.pubkey} root={root} />
          </div>
        </div>
      </div>
    </>
  );
}
