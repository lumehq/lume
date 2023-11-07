import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { LoaderIcon } from '@shared/icons';
import { MemoizedRepost, MemoizedTextNote, UnknownNote } from '@shared/notes';

import { useNostr } from '@utils/hooks/useNostr';

export function UserLatestPosts({ pubkey }: { pubkey: string }) {
  const { getEventsByPubkey } = useNostr();
  const { status, data } = useQuery({
    queryKey: ['user-posts', pubkey],
    queryFn: async () => {
      return await getEventsByPubkey(pubkey);
    },
    refetchOnWindowFocus: false,
  });

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
    <div className="mt-4 border-t border-neutral-300 pt-3 dark:border-neutral-700">
      <h3 className="mb-4 px-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Latest post
      </h3>
      <div>
        {status === 'pending' ? (
          <div className="px-3">
            <div className="inline-flex h-16 w-full items-center justify-center gap-1.5 rounded-lg bg-neutral-300 text-sm font-medium dark:bg-neutral-700">
              <LoaderIcon className="h-4 w-4 animate-spin" />
              Loading latest posts...
            </div>
          </div>
        ) : data.length < 1 ? (
          <div className="px-3">
            <div className="inline-flex h-16 w-full items-center justify-center rounded-lg bg-neutral-300 text-sm font-medium dark:bg-neutral-700">
              No posts from 24 hours ago
            </div>
          </div>
        ) : (
          data.map((event) => renderItem(event))
        )}
      </div>
    </div>
  );
}
