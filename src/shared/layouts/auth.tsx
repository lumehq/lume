import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="relative h-screen w-screen bg-black/90 backdrop-blur-xl">
      <div className="absolute left-0 top-0 z-50 h-16 w-full" data-tauri-drag-region />
      <Outlet />
    </div>
  );
}
