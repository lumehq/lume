import { type Platform } from '@tauri-apps/plugin-os';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { WindowTitleBar } from '@shared/titlebar';

export function AuthLayout({ platform }: { platform: Platform }) {
  return (
    <div className="flex h-screen w-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      {platform !== 'macos' ? (
        <WindowTitleBar platform={platform} />
      ) : (
        <div data-tauri-drag-region className="h-9 shrink-0" />
      )}
      <div className="h-full w-full">
        <Outlet />
        <ScrollRestoration />
      </div>
    </div>
  );
}
