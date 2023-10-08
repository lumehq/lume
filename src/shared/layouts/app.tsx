import { Outlet, ScrollRestoration } from 'react-router-dom';
import { WindowTitlebar } from 'tauri-controls';

import { Navigation } from '@shared/navigation';

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <WindowTitlebar />
      <div className="flex h-full min-h-0 w-full bg-zinc-50 text-zinc-50 dark:bg-zinc-950 dark:text-zinc-950">
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
