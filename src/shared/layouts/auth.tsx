import { Outlet } from 'react-router-dom';
import { WindowTitlebar } from 'tauri-controls';

export function AuthLayout() {
  return (
    <div className="relative h-screen w-screen bg-zinc-50 dark:bg-zinc-950">
      <WindowTitlebar />
      <div className="bg-zinc-50 dark:bg-zinc-950">
        <Outlet />
      </div>
    </div>
  );
}
