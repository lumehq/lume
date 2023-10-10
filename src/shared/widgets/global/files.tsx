import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { VList } from 'virtua';

import { useNDK } from '@libs/ndk/provider';

import { LoaderIcon } from '@shared/icons';
import { FileNote, NoteWrapper } from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { nHoursAgo } from '@utils/date';
import { Widget } from '@utils/types';

export function GlobalFilesWidget({ params }: { params: Widget }) {
  const { ndk } = useNDK();
  const { status, data } = useQuery(
    ['global-file-sharing'],
    async () => {
      const events = await ndk.fetchEvents({
        // @ts-expect-error, NDK not support file metadata yet
        kinds: [1063],
        since: nHoursAgo(24),
      });
      const sortedEvents = [...events].sort((x, y) => y.created_at - x.created_at);
      return sortedEvents;
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
      <div className="flex-1">
        {status === 'loading' ? (
          <div className="flex h-full w-full items-center justify-center ">
            <div className="inline-flex flex-col items-center justify-center gap-2">
              <LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-white" />
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Loading file sharing event...
              </p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center px-3">
            <div className="flex flex-col items-center gap-4">
              <img src="/ghost.png" alt="empty feeds" className="h-16 w-16" />
              <div className="text-center">
                <h3 className="font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
                  Oops, it looks like there are no file sharing events.
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  You can close this widget
                </p>
              </div>
            </div>
          </div>
        ) : (
          <VList className="h-full scrollbar-none">
            {data.map((item) => renderItem(item))}
            <div className="h-16" />
          </VList>
        )}
      </div>
    </WidgetWrapper>
  );
}
