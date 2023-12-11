import { Outlet, ScrollRestoration } from 'react-router-dom';

import { useArk } from '@libs/ark';

import { WindowTitleBar } from '@shared/titlebar';

export function NoteLayout() {
  const { ark } = useArk();

  return (
    <div className="flex h-screen w-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      {ark.platform !== 'macos' ? (
        <WindowTitleBar platform={ark.platform} />
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
