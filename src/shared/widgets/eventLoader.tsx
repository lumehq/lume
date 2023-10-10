import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useStorage } from '@libs/storage/provider';

import { useStronghold } from '@stores/stronghold';

import { useNostr } from '@utils/hooks/useNostr';

export function EventLoader({ firstTime }: { firstTime: boolean }) {
  const { db } = useStorage();
  const { getAllEventsSinceLastLogin } = useNostr();

  const setIsFetched = useStronghold((state) => state.setIsFetched);
  const queryClient = useQueryClient();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function getEvents() {
      const events = await getAllEventsSinceLastLogin();
      console.log('total new events has found: ', events.data.length);

      const promises = await Promise.all(
        events.data.map(async (event) => await db.createEvent(event))
      );

      if (promises) {
        setProgress(100);
        setIsFetched();
        // invalidate queries
        queryClient.invalidateQueries(['local-network-widget']);
      }
    }

    // only start download if progress === 0
    if (progress === 0) getEvents();

    // auto increase progress after 2 secs
    setInterval(() => setProgress((prev) => (prev += 5)), 2000);
  }, []);

  return (
    <div className="mb-3 px-3">
      <div className="h-max w-full rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
        <div className="flex flex-col items-center gap-3">
          {firstTime ? (
            <div>
              <span className="text-4xl">👋</span>
              <h3 className="mt-2 font-semibold leading-tight text-neutral-100 dark:text-neutral-900">
                Hello, this is the first time you&apos;re using Lume
              </h3>
              <p className="text-sm text-neutral-500">
                Lume is downloading all events since the last 24 hours. It will auto
                refresh when it done, please be patient
              </p>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="font-semibold leading-tight text-neutral-500 dark:text-neutral-300">
                Downloading all events while you&apos;re away...
              </h3>
            </div>
          )}
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div
              className="flex flex-col justify-center overflow-hidden bg-blue-500 transition-all duration-1000 ease-smooth"
              role="progressbar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
