import { Outlet, ScrollRestoration } from 'react-router-dom';
import { WindowTitlebar } from 'tauri-controls';

import { useStorage } from '@libs/storage/provider';

export function NoteLayout() {
  const { db } = useStorage();

  return (
    <div className="flex h-screen w-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      {db.platform !== 'macos' ? (
        <WindowTitlebar />
      ) : (
        <div data-tauri-drag-region className="h-9" />
      )}
      <div className="flex h-full min-h-0 w-full">
        <Outlet />
        <ScrollRestoration />
      </div>
    </div>
  );
}
