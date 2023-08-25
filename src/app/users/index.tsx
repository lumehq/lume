import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { UserProfile } from '@app/users/components/profile';

import { useNDK } from '@libs/ndk/provider';

import {
  ArticleNote,
  FileNote,
  NoteSkeleton,
  NoteWrapper,
  Repost,
  TextNote,
  UnknownNote,
} from '@shared/notes';

import { nHoursAgo } from '@utils/date';

export function UserScreen() {
  const { pubkey } = useParams();
  const { ndk } = useNDK();
  const { status, data } = useQuery(['user-feed', pubkey], async () => {
    const events = await ndk.fetchEvents({
      kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Article],
      authors: [pubkey],
      since: nHoursAgo(48),
    });
    return [...events] as unknown as NDKEvent[];
  });

  const parentRef = useRef();
  const virtualizer = useVirtualizer({
    count: data ? data.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 650,
    overscan: 2,
  });
  const items = virtualizer.getVirtualItems();

  // render event match event kind
  const renderItem = useCallback(
    (index: string | number) => {
      const event: NDKEvent = data[index];
      if (!event) return;

      switch (event.kind) {
        case NDKKind.Text:
          return (
            <div
              key={event.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <NoteWrapper event={event}>
                <TextNote event={event} />
              </NoteWrapper>
            </div>
          );
        case NDKKind.Repost:
          return (
            <div
              key={event.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <Repost key={event.id} event={event} />
            </div>
          );
        case 1063:
          return (
            <div
              key={event.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <NoteWrapper event={event}>
                <FileNote event={event} />
              </NoteWrapper>
            </div>
          );
        case NDKKind.Article:
          return (
            <div
              key={event.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <NoteWrapper event={event}>
                <ArticleNote event={event} />
              </NoteWrapper>
            </div>
          );
        default:
          return (
            <div
              key={event.id + index}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <NoteWrapper event={event}>
                <UnknownNote event={event} />
              </NoteWrapper>
            </div>
          );
      }
    },
    [data]
  );

  return (
    <div
      ref={parentRef}
      className="scrollbar-hide relative h-full w-full overflow-y-auto bg-white/10"
    >
      <div data-tauri-drag-region className="absolute left-0 top-0 h-11 w-full" />
      <UserProfile pubkey={pubkey} />
      <div className="mt-6 h-full w-full border-t border-white/5 px-1.5">
        <h3 className="mb-2 pt-4 text-center text-lg font-semibold leading-none text-white">
          Latest postrs
        </h3>
        <div className="mx-auto flex h-full max-w-[500px] flex-col justify-between gap-1.5 pb-4 pt-1.5">
          {status === 'loading' ? (
            <div className="px-3 py-1.5">
              <div className="rounded-xl bg-white/10 px-3 py-3">
                <NoteSkeleton />
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="px-3 py-1.5">
              <div className="rounded-xl bg-white/10 px-3 py-6">
                <div className="flex flex-col items-center gap-4">
                  <p className="text-center text-sm font-medium text-white">
                    User doesn&apos;t have any postrs in the last 48 hours.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: `${virtualizer.getTotalSize()}px`,
              }}
            >
              <div
                className="absolute left-0 top-0 w-full"
                style={{
                  transform: `translateY(${items[0].start}px)`,
                }}
              >
                {items.map((item) => renderItem(item.index))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
