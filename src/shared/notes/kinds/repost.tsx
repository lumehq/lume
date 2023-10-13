import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';
import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
            <User pubkey={embedEvent.pubkey} time={embedEvent.created_at} />
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
              <div className="inline-flex h-11 w-11 items-end justify-center rounded-lg bg-black pb-1">
                <img src="/lume.png" alt="lume" className="h-auto w-1/3" />
              </div>
              <h5 className="truncate font-semibold leading-none text-white">
                Lume <span className="text-green-500">(System)</span>
              </h5>
            </div>
            <div className="-mt-4 flex items-start gap-3">
              <div className="w-11 shrink-0" />
              <div>
                <div className="relative z-20 mt-1 flex-1 select-text">
                  <div className="mb-1 select-text rounded-lg bg-white/5 p-1.5 text-sm">
                    Lume cannot find this post with your current relays, but you can view
                    it via njump.me.{' '}
                    <Link to={noteLink} className="text-blue-500">
                      Learn more
                    </Link>
                  </div>
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
          <User pubkey={data.pubkey} time={data.created_at} />
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
