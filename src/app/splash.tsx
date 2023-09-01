import { invoke } from '@tauri-apps/api/tauri';
import { message } from '@tauri-apps/plugin-dialog';
import { useEffect, useState } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function SplashScreen() {
  const { db } = useStorage();
  const { ndk, relayUrls } = useNDK();
  const { fetchUserData, prefetchEvents } = useNostr();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

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

      if (user.status === 'ok' && data.status === 'ok') {
        await db.updateLastLogin();
        await invoke('close_splashscreen');
      } else {
        setIsLoading(false);
        setErrorMessage(user.message);
        console.log('fetch failed, error: ', user.message);
      }
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(e);
      await message(`Something wrong: ${e}`, {
        title: 'Lume',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    if (!db.account) {
      invoke('close_splashscreen');
    }

    if (ndk && db.account) {
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
                {!ndk
                  ? 'Connecting to relay...'
                  : `Connected to ${relayUrls.length} relays`}
              </h3>
              <p className="text-sm text-white/50">
                This may take a few seconds, please don&apos;t close app.
              </p>
            </div>
          ) : (
            <div className="mt-2 flex flex-col gap-1 text-center">
              <h3 className="text-lg font-semibold leading-none text-white">
                Something wrong!
              </h3>
              <p className="text-sm text-white/50">{errorMessage}</p>
              <button
                type="button"
                onClick={skip}
                className="mx-auto mt-4 inline-flex h-10 w-max items-center justify-center rounded-md bg-white/10 px-8 text-sm font-medium leading-none text-white backdrop-blur-xl hover:bg-white/20"
              >
                Skip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
