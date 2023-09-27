import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useStorage } from '@libs/storage/provider';

import { useNostr } from '@utils/hooks/useNostr';
import { useStronghold } from '@stores/stronghold';

export function EmptyList() {
  const { db } = useStorage();
  const { getAllEventsSinceLastLogin } = useNostr();

  const setIsFetched = useStronghold((state) => state.setIsFetched);
  const queryClient = useQueryClient();
  
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function getEvents() {
      const events = await getAllEventsSinceLastLogin();
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
    setInterval(() => setProgress((prev) => (prev += 8)), 2000);
  }, []);

  return (
    <div className="px-3">
      <div className="h-max w-full rounded-lg border-t border-white/10 bg-white/20 p-3">
        <div className="flex flex-col items-center gap-5">
          <div>
            <span className="text-4xl">👋</span>
            <h3 className="mt-2 font-semibold leading-tight">
              Hello, this is the first time you&apos;re using Lume
            </h3>
            <p className="text-sm text-white/70">
              Lume is downloading all events since the last 24 hours. It will auto refresh
              when it done, please be patient
            </p>
          </div>
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="flex flex-col justify-center overflow-hidden bg-fuchsia-500 transition-all duration-1000 ease-smooth"
              role="progressbar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
