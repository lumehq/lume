import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { VList } from 'virtua';

import { useNDK } from '@libs/ndk/provider';

import { FileNote, NoteSkeleton, NoteWrapper } from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { Widget } from '@utils/types';

export function GlobalFilesWidget({ params }: { params: Widget }) {
  const { ndk } = useNDK();
  const { status, data } = useQuery(
    [params.id + '-' + params.title],
    async () => {
      const events = await ndk.fetchEvents({
        // @ts-expect-error, NDK not support file metadata yet
        kinds: [1063],
        limit: 100,
      });
      return [...events] as unknown as NDKEvent[];
    },
    { refetchOnWindowFocus: false }
  );

  // render event match event kind
  const renderItem = useCallback(
    (event: NDKEvent) => {
      return (
        <NoteWrapper key={event.id} event={event}>
          <FileNote />
        </NoteWrapper>
      );
    },
    [data]
  );

  return (
    <WidgetWrapper>
      <TitleBar id={params.id} title={params.title} />
      <div className="h-full">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
              <NoteSkeleton />
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center px-3">
            <div className="flex flex-col items-center gap-4">
              <img src="/ghost.png" alt="empty feeds" className="h-16 w-16" />
              <div className="text-center">
                <h3 className="text-xl font-semibold leading-tight">
                  Your newsfeed is empty
                </h3>
                <p className="text-center text-white/50">
                  Connect more people to explore more content
                </p>
              </div>
            </div>
          </div>
        ) : (
          <VList className="scrollbar-hide h-full">
            {data.map((item) => renderItem(item))}
            <div className="h-16" />
          </VList>
        )}
      </div>
    </WidgetWrapper>
  );
}
