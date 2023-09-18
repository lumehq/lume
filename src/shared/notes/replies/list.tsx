import { useEffect, useState } from 'react';

import { NoteSkeleton, Reply } from '@shared/notes';

import { useNostr } from '@utils/hooks/useNostr';
import { NDKEventWithReplies } from '@utils/types';

export function RepliesList({ id }: { id: string }) {
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
      <div className="mt-5 pb-10">
        <div className="flex flex-col">
          <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
            <NoteSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 pb-10">
      <h5 className="mb-2 text-lg font-semibold text-white">
        {data?.length || 0} replies
      </h5>
      <div className="flex flex-col gap-3">
        {data?.length === 0 ? (
          <div className="mt-2 flex w-full items-center justify-center rounded-xl bg-white/10 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center gap-2 py-6">
              <h3 className="text-3xl">👋</h3>
              <p className="leading-none text-white/50">Share your thought on it...</p>
            </div>
          </div>
        ) : (
          data.map((event) => <Reply key={event.id} event={event} root={id} />)
        )}
      </div>
    </div>
  );
}
