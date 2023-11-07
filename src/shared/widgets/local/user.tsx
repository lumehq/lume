import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { WVList } from 'virtua';

import { useNDK } from '@libs/ndk/provider';

import {
  MemoizedRepost,
  MemoizedTextNote,
  NoteSkeleton,
  UnknownNote,
} from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { UserProfile } from '@shared/userProfile';
import { WidgetWrapper } from '@shared/widgets';

import { nHoursAgo } from '@utils/date';
import { Widget } from '@utils/types';

export function LocalUserWidget({ params }: { params: Widget }) {
  const { ndk } = useNDK();
  const { status, data } = useQuery({
    queryKey: ['user-posts', params.content],
    queryFn: async () => {
      const rootIds = new Set();
      const dedupQueue = new Set();

      const events = await ndk.fetchEvents({
        kinds: [NDKKind.Text, NDKKind.Repost],
        authors: [params.content],
        since: nHoursAgo(24),
      });

      const ndkEvents = [...events];

      ndkEvents.forEach((event) => {
        const tags = event.tags.filter((el) => el[0] === 'e');
        if (tags && tags.length > 0) {
          const rootId = tags.filter((el) => el[3] === 'root')[1] ?? tags[0][1];
          if (rootIds.has(rootId)) return dedupQueue.add(event.id);
          rootIds.add(rootId);
        }
      });

      return ndkEvents
        .filter((event) => !dedupQueue.has(event.id))
        .sort((a, b) => b.created_at - a.created_at);
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  // render event match event kind
  const renderItem = useCallback(
    (event: NDKEvent) => {
      switch (event.kind) {
        case NDKKind.Text:
          return <MemoizedTextNote key={event.id} event={event} />;
        case NDKKind.Repost:
          return <MemoizedRepost key={event.id} event={event} />;
        default:
          return <UnknownNote key={event.id} event={event} />;
      }
    },
    [data]
  );

  return (
    <WidgetWrapper>
      <TitleBar id={params.id} title={params.title} />
      <WVList className="flex-1 overflow-y-auto">
        <div className="px-3 pt-1.5">
          <UserProfile pubkey={params.content} />
        </div>
        <div>
          <h3 className="mb-3 mt-4 px-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Latest posts
          </h3>
          <div className="flex h-full w-full flex-col justify-between gap-1.5 pb-10">
            {status === 'pending' ? (
              <div className="px-3 py-1.5">
                <div className="rounded-xl bg-neutral-100 px-3 py-3 dark:bg-neutral-900">
                  <NoteSkeleton />
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="px-3 py-1.5">
                <div className="rounded-xl bg-neutral-100 px-3 py-6 dark:bg-neutral-900">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-center text-sm text-neutral-900 dark:text-neutral-100">
                      No new post from 24 hours ago
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              data.map((item) => renderItem(item))
            )}
          </div>
        </div>
      </WVList>
    </WidgetWrapper>
  );
}
