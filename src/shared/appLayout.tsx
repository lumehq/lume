import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Navigation } from '@shared/navigation';

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen">
      <div className="relative flex shrink-0 flex-row">
        <Navigation />
      </div>
      <div className="h-full w-full">
        <Outlet />
        <ScrollRestoration />
      </div>
    </div>
  );
}
