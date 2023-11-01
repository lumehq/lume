import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';

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

  if (status === 'pending') {
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
            <div className="inline-flex h-10 w-10 shrink-0 items-end justify-center rounded-lg bg-black"></div>
            <h5 className="truncate font-semibold leading-none text-neutral-900 dark:text-neutral-100">
              Lume <span className="text-teal-500">(System)</span>
            </h5>
          </div>
          <div className="-mt-4 flex items-start gap-3">
            <div className="w-10 shrink-0" />
            <div className="flex-1">
              <div className="prose prose-neutral max-w-none select-text whitespace-pre-line break-all leading-normal dark:prose-invert prose-headings:mb-1 prose-headings:mt-3 prose-p:mb-0 prose-p:mt-0 prose-p:last:mb-1 prose-a:font-normal prose-a:text-blue-500 prose-blockquote:mb-1 prose-blockquote:mt-1 prose-blockquote:border-l-[2px] prose-blockquote:border-blue-500 prose-blockquote:pl-2 prose-pre:whitespace-pre-wrap prose-pre:break-words prose-pre:break-all prose-pre:bg-white/10 prose-ol:m-0 prose-ol:mb-1 prose-ul:mb-1 prose-ul:mt-1 prose-img:mb-2 prose-img:mt-3 prose-hr:mx-0 prose-hr:my-2 hover:prose-a:text-blue-500">
                Lume cannot find this post with your current relay set, but you can view
                it via njump.me
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
        <User pubkey={data.pubkey} time={data.created_at} eventId={data.id} />
        <div className="-mt-4 flex items-start gap-3">
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
