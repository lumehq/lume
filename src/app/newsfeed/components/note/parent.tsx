import NoteMetadata from '@lume/app/newsfeed/components/note/metadata';
import { NoteDefaultUser } from '@lume/app/newsfeed/components/user/default';
import { noteParser } from '@lume/app/note/components/parser';
import ImagePreview from '@lume/app/note/components/preview/image';
import VideoPreview from '@lume/app/note/components/preview/video';
import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';

import { memo, useContext } from 'react';
import useSWRSubscription from 'swr/subscription';

export const NoteParent = memo(function NoteParent({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);

  const { data, error } = useSWRSubscription(id ? id : null, (key, { next }) => {
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

  const content = !error && data ? noteParser(data) : null;

  return (
    <div className="relative pb-5">
      {error && <div>failed to load</div>}
      {!data ? (
        <>
          <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
          <div className="animated-pulse relative z-10">
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
        </>
      ) : (
        <>
          <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
          <div className="relative z-10 flex flex-col">
            <NoteDefaultUser pubkey={data.pubkey} time={data.created_at} />
            <div className="mt-1 pl-[52px]">
              <div className="whitespace-pre-line break-words text-[15px] leading-tight text-zinc-100">
                {content ? content.parsed : ''}
              </div>
              {Array.isArray(content.images) && content.images.length ? <ImagePreview urls={content.images} /> : <></>}
              {Array.isArray(content.videos) && content.videos.length ? <VideoPreview urls={content.videos} /> : <></>}
            </div>
            <div onClick={(e) => e.stopPropagation()} className="mt-5 pl-[52px]">
              <NoteMetadata id={data.id} eventPubkey={data.pubkey} />
            </div>
          </div>
        </>
      )}
    </div>
  );
});
