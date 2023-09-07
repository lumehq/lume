import { message } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';

import { useActivities } from '@stores/activities';

import { useNostr } from '@utils/hooks/useNostr';

export function SplashScreen() {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { fetchUserData, fetchActivities, prefetchEvents } = useNostr();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setActivities = useActivities((state) => state.setActivities);

  const skip = async () => {
    await invoke('close_splashscreen');
  };

  const prefetch = async () => {
    const onboarding = localStorage.getItem('onboarding');
    const step = JSON.parse(onboarding).state.step || null;
    if (step) await invoke('close_splashscreen');

    try {
      const user = await fetchUserData();
      const data = await prefetchEvents();
      const activities = await fetchActivities();

      if (user.status === 'ok' && data.status === 'ok') {
        // set activities
        setActivities(activities);
        // update last login = current time
        await db.updateLastLogin();
        // close splash screen and open main app screen
        await invoke('close_splashscreen');
      }
    } catch (e) {
      setIsLoading(false);
      await message(e, {
        title: 'An unexpected error has occurred',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    if (ndk) {
      if (!db.account) invoke('close_splashscreen');

      console.log('prefetching...');
      prefetch();
    }
  }, [ndk, db.account]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black">
      <div data-tauri-drag-region className="absolute left-0 top-0 z-10 h-11 w-full" />
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <LoaderIcon className="h-6 w-6 animate-spin text-white" />
          {isLoading ? (
            <div className="flex flex-col gap-1 text-center">
              <h3 className="text-lg font-semibold leading-none text-white">
                {!ndk ? 'Connecting to relay...' : 'Fetching events from the last login.'}
              </h3>
              <p className="text-sm text-white/50">
                This may take a few seconds, please don&apos;t close app.
              </p>
            </div>
          ) : (
            <div className="mt-2 flex flex-col gap-1 text-center">
              <h3 className="text-lg font-semibold leading-none text-white">
                An unexpected error has occurred
              </h3>
              <button
                type="button"
                onClick={skip}
                className="mx-auto mt-4 inline-flex h-10 w-max items-center justify-center rounded-md bg-white/10 px-8 text-sm font-medium leading-none text-white backdrop-blur-xl hover:bg-white/20"
              >
                Skip this step
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
