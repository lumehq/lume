import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { updateLastLogin } from '@libs/storage';

import { LoaderIcon } from '@shared/icons';

import { useAccount } from '@utils/hooks/useAccount';
import { useNostr } from '@utils/hooks/useNostr';

export function SplashScreen() {
  const { ndk, relayUrls } = useNDK();
  const { status, account } = useAccount();
  const { fetchChats, fetchNotes } = useNostr();

  const [loading, setLoading] = useState(true);

  const skip = async () => {
    await invoke('close_splashscreen');
  };

  const prefetch = async () => {
    const onboarding = localStorage.getItem('onboarding');
    const step = JSON.parse(onboarding).state.step || null;
    if (step) await invoke('close_splashscreen');

    const notes = await fetchNotes();
    const chats = await fetchChats();

    if (notes.status === 'ok' && chats.status === 'ok') {
      const now = Math.floor(Date.now() / 1000);
      await updateLastLogin(now);
      invoke('close_splashscreen');
    } else {
      setLoading(false);
      console.log('fetch notes failed, error: ', notes.message);
      console.log('fetch chats failed, error: ', chats.message);
    }
  };

  useEffect(() => {
    if (status === 'success' && !account) {
      invoke('close_splashscreen');
    }

    if (ndk && account) {
      console.log('prefetching...');
      prefetch();
    }
  }, [ndk, account]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black">
      <div data-tauri-drag-region className="absolute left-0 top-0 z-10 h-11 w-full" />
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <LoaderIcon className="h-6 w-6 animate-spin text-white" />
          {loading ? (
            <div className="mt-2 flex flex-col gap-1 text-center">
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
              <p className="text-sm text-white/50">
                Connect process failed, click skip to continue.
              </p>
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
