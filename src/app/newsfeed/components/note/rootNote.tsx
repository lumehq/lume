import { contentParser } from '@lume/app/newsfeed/components/contentParser';
import { NoteDefaultUser } from '@lume/app/newsfeed/components/user/default';
import { READONLY_RELAYS } from '@lume/stores/constants';

import { RelayPool } from 'nostr-relaypool';
import { memo } from 'react';
import useSWRSubscription from 'swr/subscription';
import { navigate } from 'vite-plugin-ssr/client/router';

export const RootNote = memo(function RootNote({ id, fallback }: { id: string; fallback?: any }) {
  const parseFallback = fallback.length > 0 ? JSON.parse(fallback) : null;

  const { data, error } = useSWRSubscription(parseFallback ? null : id, (key, { next }) => {
    const pool = new RelayPool(READONLY_RELAYS);
    const unsubscribe = pool.subscribe(
      [
        {
          ids: [key],
        },
      ],
      READONLY_RELAYS,
      (event: any) => {
        next(null, event);
      },
      undefined,
      undefined,
      {
        unsubscribeOnEose: true,
      }
    );

    return () => {
      unsubscribe();
    };
  });

  const openThread = (e) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      navigate(`/newsfeed/note?id=${id}`);
    } else {
      e.stopPropagation();
    }
  };

  if (parseFallback) {
    return (
      <div onClick={(e) => openThread(e)} className="relative z-10 flex flex-col">
        <NoteDefaultUser pubkey={parseFallback.pubkey} time={parseFallback.created_at} />
        <div className="mt-1 pl-[52px]">
          <div className="whitespace-pre-line break-words text-[15px] leading-tight text-zinc-100">
            {contentParser(parseFallback.content, parseFallback.tags)}
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()} className="mt-5 pl-[52px]"></div>
      </div>
    );
  }

  return (
    <>
      {error && <div>failed to load</div>}
      {!data ? (
        <div className="relative z-10 flex h-min animate-pulse select-text flex-col">
          <div className="flex items-start gap-2">
            <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-zinc-700" />
            <div className="flex w-full flex-1 items-start justify-between">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-4 w-16 rounded bg-zinc-700" />
                </div>
              </div>
            </div>
          </div>
          <div className="-mt-5 pl-[52px]">
            <div className="flex flex-col gap-6">
              <div className="h-16 w-full rounded bg-zinc-700" />
              <div className="flex items-center gap-8">
                <div className="h-4 w-12 rounded bg-zinc-700" />
                <div className="h-4 w-12 rounded bg-zinc-700" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div onClick={(e) => openThread(e)} className="relative z-10 flex flex-col">
          <NoteDefaultUser pubkey={data.pubkey} time={data.created_at} />
          <div className="mt-1 pl-[52px]">
            <div className="whitespace-pre-line break-words text-[15px] leading-tight text-zinc-100">
              {contentParser(data.content, data.tags)}
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()} className="mt-5 pl-[52px]"></div>
        </div>
      )}
    </>
  );
});
