import { message } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function SplashScreen() {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { fetchUserData } = useNostr();

  useEffect(() => {
    async function syncUserData() {
      if (!db.account) {
        await invoke('close_splashscreen');
      } else {
        const onboarding = localStorage.getItem('onboarding');
        const step = JSON.parse(onboarding).state.step || null;

        if (step) {
          await invoke('close_splashscreen');
        } else {
          try {
            const userData = await fetchUserData();
            if (userData.status === 'ok') {
              // update last login = current time
              await db.updateLastLogin();
              // close splash screen and open main app screen
              await invoke('close_splashscreen');
            }
          } catch (e) {
            await message(e, {
              title: 'An unexpected error has occurred',
              type: 'error',
            });
            await invoke('close_splashscreen');
          }
        }
      }
    }

    if (ndk) {
      syncUserData();
    }
  }, [ndk, db.account]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black">
      <div data-tauri-drag-region className="absolute left-0 top-0 z-10 h-11 w-full" />
      <div className="flex min-h-0 w-full flex-1 items-center justify-center px-8">
        <div className="flex flex-col items-center justify-center gap-6">
          <LoaderIcon className="h-6 w-6 animate-spin text-white" />
          <h3 className="text-lg font-semibold leading-none text-white">
            {!ndk ? 'Connecting...' : 'Syncing...'}
          </h3>
        </div>
      </div>
    </div>
  );
}
