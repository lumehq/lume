import { Outlet } from 'react-router-dom';
import { WindowTitlebar } from 'tauri-controls';

export function AuthLayout() {
  return (
    <div className="relative h-screen w-screen bg-neutral-50 dark:bg-neutral-950">
      <WindowTitlebar />
      <div className="bg-neutral-50 dark:bg-neutral-950">
        <Outlet />
      </div>
    </div>
  );
}
