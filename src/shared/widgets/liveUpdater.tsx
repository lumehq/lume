import { NDKEvent, NDKFilter, NDKKind, NDKSubscription } from '@nostr-dev-kit/ndk';
import { QueryStatus, useQueryClient } from '@tanstack/react-query';
import { forwardRef, useEffect, useState } from 'react';
import { VListHandle } from 'virtua';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { ChevronUpIcon } from '@shared/icons';

export const LiveUpdater = forwardRef(function LiveUpdater({
  status,
  ref,
}: {
  status: QueryStatus;
  ref: VListHandle;
}) {
  const { db } = useStorage();
  const { ndk } = useNDK();

  const [events, setEvents] = useState<NDKEvent[]>([]);
  const queryClient = useQueryClient();

  const update = async () => {
    await queryClient.setQueryData(
      ['newsfeed'],
      (prev: { pageParams: number; pages: Array<NDKEvent[]> }) => ({
        ...prev,
        pages: [[...events], ...prev.pages],
      })
    );

    // reset
    setEvents([]);

    // scroll to top
    ref.scrollToIndex(0, { smooth: true });
  };

  useEffect(() => {
    let sub: NDKSubscription = undefined;

    if (status === 'success' && db.account && db.account.circles.length > 0) {
      queryClient.fetchQuery({ queryKey: ['notification'] });

      const filter: NDKFilter = {
        kinds: [NDKKind.Text, NDKKind.Repost],
        authors: db.account.circles,
        since: Math.floor(Date.now() / 1000),
      };

      sub = ndk.subscribe(filter, { closeOnEose: false, groupable: false });
      sub.addListener('event', (event: NDKEvent) =>
        setEvents((prev) => [...prev, event])
      );
    }

    return () => {
      if (sub) sub.stop();
    };
  }, [status]);

  if (!events.length) return null;

  return (
    <div className="absolute left-0 top-11 z-50 flex h-11 w-full items-center justify-center">
      <button
        type="button"
        onClick={update}
        className="inline-flex h-9 w-max items-center justify-center gap-1 rounded-full bg-blue-500 px-2.5 text-sm font-semibold text-white hover:bg-blue-600"
      >
        <ChevronUpIcon className="h-4 w-4" />
        {events.length} posts
      </button>
    </div>
  );
});
