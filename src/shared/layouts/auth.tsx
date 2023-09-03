import { Outlet } from 'react-router-dom';

import { Frame } from '@shared/frame';

export function AuthLayout() {
  return (
    <Frame className="relative h-screen w-screen">
      <div className="absolute left-0 top-0 z-50 h-16 w-full" data-tauri-drag-region />
      <Outlet />
    </Frame>
  );
}
