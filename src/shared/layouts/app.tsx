import { Outlet, ScrollRestoration } from 'react-router-dom';
import { WindowTitlebar } from 'tauri-controls';

import { Navigation } from '@shared/navigation';

export function AppLayout() {
  return (
    <div className="h-screen w-screen bg-zinc-50 text-zinc-50 dark:bg-zinc-950 dark:text-zinc-950">
      <WindowTitlebar className="border-b border-zinc-200 dark:border-zinc-800" />
      <div className="flex h-full">
        <div className="h-full shrink-0">
          <Navigation />
        </div>
        <div className="h-full flex-1">
          <Outlet />
          <ScrollRestoration
            getKey={(location) => {
              return location.pathname;
            }}
          />
        </div>
      </div>
    </div>
  );
}
