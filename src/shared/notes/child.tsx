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

  if (status === 'loading') {
    return (
      <div className="relative mb-5 overflow-hidden rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
        <NoteSkeleton />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mb-5 flex flex-col gap-1.5 overflow-hidden rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
        <p className="text-sm font-bold text-white">
          Lume cannot found the event with ID
        </p>
        <div className="inline-flex items-center justify-center rounded-xl border border-dashed border-red-400 bg-red-200/10 p-2">
          <p className="select-text break-all text-sm font-medium text-red-400">{id}</p>
        </div>
      </div>
    );
  }

  const renderKind = (event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Text:
        return <TextNote event={event} />;
      case NDKKind.Article:
        return <ArticleNote event={event} />;
      case 1063:
        return <FileNote event={event} />;
      default:
        return <UnknownNote event={event} />;
    }
  };

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
