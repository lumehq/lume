import { ContentMarkdown } from '@lume/app/note/components/markdown';
import NoteMetadata from '@lume/app/note/components/metadata';
import { noteParser } from '@lume/app/note/components/parser';
import ImagePreview from '@lume/app/note/components/preview/image';
import VideoPreview from '@lume/app/note/components/preview/video';
import { NoteDefaultUser } from '@lume/app/note/components/user/default';
import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';

import { memo, useContext } from 'react';
import useSWRSubscription from 'swr/subscription';
import { navigate } from 'vite-plugin-ssr/client/router';

function isJSON(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const RootNote = memo(function RootNote({ id, fallback }: { id: string; fallback?: any }) {
  const pool: any = useContext(RelayContext);
  const parseFallback = isJSON(fallback) ? JSON.parse(fallback) : null;

  const { data, error } = useSWRSubscription(parseFallback ? null : id, (key, { next }) => {
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

  const openNote = (e) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      navigate(`/app/note?id=${id}`);
    } else {
      e.stopPropagation();
    }
  };

  const content = !error && data ? noteParser(data) : null;

  if (parseFallback) {
    const contentFallback = noteParser(parseFallback);

    return (
      <div onClick={(e) => openNote(e)} className="relative z-10 flex flex-col">
        <NoteDefaultUser pubkey={parseFallback.pubkey} time={parseFallback.created_at} />
        <div className="mt-1 pl-[52px]">
          <ContentMarkdown content={contentFallback.parsed} />
          {Array.isArray(contentFallback.images) && contentFallback.images.length ? (
            <ImagePreview urls={contentFallback.images} />
          ) : (
            <></>
          )}
          {Array.isArray(contentFallback.videos) && contentFallback.videos.length ? (
            <VideoPreview urls={contentFallback.videos} />
          ) : (
            <></>
          )}
        </div>
        <div onClick={(e) => e.stopPropagation()} className="mt-5 pl-[52px]">
          <NoteMetadata id={parseFallback.id} eventPubkey={parseFallback.pubkey} />
        </div>
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
        <div onClick={(e) => openNote(e)} className="relative z-10 flex flex-col">
          <NoteDefaultUser pubkey={data.pubkey} time={data.created_at} />
          <div className="mt-1 pl-[52px]">
            <ContentMarkdown content={content.parsed} />
            {Array.isArray(content.images) && content.images.length ? <ImagePreview urls={content.images} /> : <></>}
            {Array.isArray(content.videos) && content.videos.length ? <VideoPreview urls={content.videos} /> : <></>}
          </div>
          <div onClick={(e) => e.stopPropagation()} className="mt-5 pl-[52px]">
            <NoteMetadata id={data.id} eventPubkey={data.pubkey} />
          </div>
        </div>
      )}
    </>
  );
});
