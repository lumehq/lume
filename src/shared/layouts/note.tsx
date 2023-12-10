import { Outlet, ScrollRestoration } from 'react-router-dom';
import { WindowTitlebar } from 'tauri-controls';

import { useArk } from '@libs/ark';

export function NoteLayout() {
  const { ark } = useArk();

  return (
    <div className="flex h-screen w-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      {ark.platform !== 'macos' ? (
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
