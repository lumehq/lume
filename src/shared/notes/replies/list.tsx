import { NDKSubscription } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';

import { useArk } from '@libs/ark';

import { LoaderIcon } from '@shared/icons';
import { Reply } from '@shared/notes';

import { NDKEventWithReplies } from '@utils/types';

export function ReplyList({ eventId }: { eventId: string }) {
  const { ark } = useArk();
  const [data, setData] = useState<null | NDKEventWithReplies[]>(null);

  useEffect(() => {
    let sub: NDKSubscription;
    let isCancelled = false;

    async function fetchRepliesAndSub() {
      const events = await ark.getThreads({ id: eventId });
      if (!isCancelled) {
        setData(events);
      }
      // subscribe for new replies
      sub = ark.subscribe({
        filter: {
          '#e': [eventId],
          since: Math.floor(Date.now() / 1000),
        },
        closeOnEose: false,
        cb: (event: NDKEventWithReplies) => setData((prev) => [event, ...prev]),
      });
    }

    fetchRepliesAndSub();

    return () => {
      isCancelled = true;
      if (sub) sub.stop();
    };
  }, [eventId]);

  if (!data) {
    return (
      <div className="mt-3">
        <div className="flex h-16 items-center justify-center rounded-xl bg-neutral-50 p-3 dark:bg-neutral-950">
          <LoaderIcon className="h-5 w-5 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-5">
      <h3 className="font-semibold">Replies</h3>
      {data?.length === 0 ? (
        <div className="mt-2 flex w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 py-6">
            <h3 className="text-3xl">👋</h3>
            <p className="leading-none text-neutral-600 dark:text-neutral-400">
              Be the first to Reply!
            </p>
          </div>
        </div>
      ) : (
        data.map((event) => <Reply key={event.id} event={event} />)
      )}
    </div>
  );
}
