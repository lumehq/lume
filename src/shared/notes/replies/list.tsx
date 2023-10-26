import { useEffect, useState } from 'react';

import { LoaderIcon } from '@shared/icons';
import { Reply } from '@shared/notes';

import { useNostr } from '@utils/hooks/useNostr';
import { NDKEventWithReplies } from '@utils/types';

export function ReplyList({ id }: { id: string }) {
  const { fetchAllReplies, sub } = useNostr();
  const [data, setData] = useState<null | NDKEventWithReplies[]>(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchRepliesAndSub() {
      const events = await fetchAllReplies(id);
      if (!isCancelled) {
        setData(events);
      }
      // subscribe for new replies
      sub(
        {
          '#e': [id],
          since: Math.floor(Date.now() / 1000),
        },
        (event: NDKEventWithReplies) => setData((prev) => [event, ...prev]),
        false
      );
    }
    fetchRepliesAndSub();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (!data) {
    return (
      <div className="mt-3">
        <div className="flex h-16 items-center justify-center rounded-xl bg-neutral-100 px-3 py-3 dark:bg-neutral-900">
          <LoaderIcon className="h-5 w-5 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-5">
      {data?.length === 0 ? (
        <div className="mt-2 flex w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 py-6">
            <h3 className="text-3xl">👋</h3>
            <p className="leading-none text-neutral-600 dark:text-neutral-400">
              Share your thought on it...
            </p>
          </div>
        </div>
      ) : (
        data.map((event) => <Reply key={event.id} event={event} root={id} />)
      )}
    </div>
  );
}
