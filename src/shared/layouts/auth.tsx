import { Outlet } from 'react-router-dom';
import { WindowTitlebar } from 'tauri-controls';

export function AuthLayout() {
  return (
    <div className="relative h-screen w-screen bg-zinc-50 dark:bg-zinc-950">
      <WindowTitlebar className="border-b border-zinc-200 dark:border-zinc-800" />
      <div className="bg-zinc-100 dark:bg-zinc-900">
        <Outlet />
      </div>
    </div>
  );
}
