import { Outlet } from 'react-router-dom';
import { WindowTitlebar } from 'tauri-controls';

import { useStorage } from '@libs/storage/provider';

export function AuthLayout() {
  const { db } = useStorage();

  return (
    <div className="relative h-screen w-screen bg-neutral-50 dark:bg-neutral-950">
      {db.platform !== 'macos' ? <WindowTitlebar /> : null}
      <div className="bg-neutral-50 dark:bg-neutral-950">
        <Outlet />
      </div>
    </div>
  );
}
