import { NDKEvent, NDKKind, NDKSubscription } from '@nostr-dev-kit/ndk';
import { QueryStatus, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useArk } from '@libs/ark';
import { ChevronUpIcon } from '@shared/icons';

export function LiveUpdater({ status }: { status: QueryStatus }) {
  const ark = useArk();
  const queryClient = useQueryClient();

  const [events, setEvents] = useState<NDKEvent[]>([]);

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
  };

  useEffect(() => {
    let sub: NDKSubscription = undefined;

    if (status === 'success' && ark.account && ark.account?.contacts?.length > 0) {
      sub = ark.subscribe({
        filter: {
          kinds: [NDKKind.Text, NDKKind.Repost],
          authors: ark.account.contacts,
          since: Math.floor(Date.now() / 1000),
        },
        closeOnEose: false,
        cb: (event: NDKEvent) => setEvents((prev) => [...prev, event]),
      });
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
}
