import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Navigation } from '@shared/navigation';

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen">
      <div className="shrink-0">
        <Navigation />
      </div>
      <div className="h-full w-full flex-1 bg-black/90">
        <Outlet />
        <ScrollRestoration
          getKey={(location) => {
            return location.pathname;
          }}
        />
      </div>
    </div>
  );
}
