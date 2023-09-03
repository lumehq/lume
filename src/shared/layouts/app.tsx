import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Frame } from '@shared/frame';
import { Navigation } from '@shared/navigation';

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen">
      <div className="shrink-0">
        <Navigation />
      </div>
      <Frame className="h-full w-full flex-1">
        <Outlet />
        <ScrollRestoration
          getKey={(location) => {
            return location.pathname;
          }}
        />
      </Frame>
    </div>
  );
}
