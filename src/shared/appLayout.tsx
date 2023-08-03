import { LogicalSize, appWindow } from '@tauri-apps/plugin-window';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Navigation } from '@shared/navigation';

await appWindow.setSize(new LogicalSize(1080, 800));

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen">
      <div className="shrink-0">
        <Navigation />
      </div>
      <div className="h-full w-full flex-1 bg-black/90">
        <Outlet />
        <ScrollRestoration />
      </div>
    </div>
  );
}
