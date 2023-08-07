import { invoke } from '@tauri-apps/api/tauri';
import { platform } from '@tauri-apps/plugin-os';
import { appWindow } from '@tauri-apps/plugin-window';
import { useEffect } from 'react';

import { getActiveAccount, updateLastLogin } from '@libs/storage';

import { LoaderIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

const account = await getActiveAccount();
const osPlatform = await platform();

if (osPlatform !== 'macos') {
  appWindow.setDecorations(false);
}

export function SplashScreen() {
  const { fetchChats, fetchNotes } = useNostr();

  useEffect(() => {
    async function prefetch() {
      const notes = await fetchNotes();
      const chats = await fetchChats();
      if (notes && chats) {
        const now = Math.floor(Date.now() / 1000);
        await updateLastLogin(now);
        invoke('close_splashscreen');
      }
    }

    if (account) {
      prefetch();
    }
  }, []);

  if (!account) {
    setTimeout(() => invoke('close_splashscreen'), 1000);
  }

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black">
      <div data-tauri-drag-region className="absolute left-0 top-0 z-10 h-11 w-full" />
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <LoaderIcon className="h-6 w-6 animate-spin text-white" />
          <div className="flex flex-col gap-1 text-center">
            <h3 className="font-semibold leading-none text-white">Prefetching data</h3>
            <p className="text-sm leading-none text-white/50">
              This may take a few seconds, please don&apos;t close app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
