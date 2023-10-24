import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';
import { memo, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

import { useNDK } from '@libs/ndk/provider';

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

export function Repost({
  event,
  lighter = false,
}: {
  event: NDKEvent;
  lighter?: boolean;
}) {
  const embedEvent: null | NDKEvent =
    event.content.length > 0 ? JSON.parse(event.content) : null;

  const { ndk } = useNDK();
  const { status, isError, data } = useQuery(
    ['repost', event.id],
    async () => {
      const id = event.tags.find((el) => el[0] === 'e')[1];
      if (!id) throw new Error('wrong id');

      const ndkEvent = await ndk.fetchEvent(id);
      if (!ndkEvent) return Promise.reject(new Error('event not found'));

      return ndkEvent;
    },
    {
      enabled: embedEvent === null,
      refetchOnWindowFocus: false,
    }
  );

  const renderKind = useCallback((repostEvent: NDKEvent) => {
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
  }, []);

  if (embedEvent) {
    return (
      <div className="h-min w-full px-3 pb-3">
        <div
          className={twMerge(
            'relative flex flex-col gap-1 overflow-hidden rounded-xl px-3 py-3',
            !lighter ? 'bg-neutral-100 dark:bg-neutral-900' : 'bg-transparent'
          )}
        >
          <User pubkey={event.pubkey} time={event.created_at} variant="repost" />
          <div className="relative flex flex-col">
            <User
              pubkey={embedEvent.pubkey}
              time={embedEvent.created_at}
              eventId={embedEvent.id}
            />
            <div className="-mt-4 flex items-start gap-3">
              <div className="w-10 shrink-0" />
              <div className="relative z-20 flex-1">
                {renderKind(embedEvent)}
                <NoteActions id={embedEvent.id} pubkey={embedEvent.pubkey} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="h-min w-full px-3 pb-3">
        <div className="relative overflow-hidden rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
          <NoteSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    const noteLink = `https://njump.me/${nip19.noteEncode(
      event.tags.find((el) => el[0] === 'e')[1]
    )}`;

    return (
      <div className="h-min w-full px-3 pb-3">
        <div
          className={twMerge(
            'relative overflow-hidden rounded-xl px-3 py-3',
            !lighter ? 'bg-neutral-100 dark:bg-neutral-900' : 'bg-transparent'
          )}
        >
          <div className="relative flex flex-col">
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
        </div>
      </div>
    );
  }

  return (
    <div className="h-min w-full px-3 pb-3">
      <div
        className={twMerge(
          'relative flex flex-col gap-1 overflow-hidden rounded-xl px-3 py-3',
          !lighter ? 'bg-neutral-100 dark:bg-neutral-900' : 'bg-transparent'
        )}
      >
        <User pubkey={event.pubkey} time={event.created_at} variant="repost" />
        <div className="relative flex flex-col">
          <User pubkey={data.pubkey} time={data.created_at} eventId={data.id} />
          <div className="-mt-4 flex items-start gap-3">
            <div className="w-10 shrink-0" />
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

export const MemoizedRepost = memo(Repost);
