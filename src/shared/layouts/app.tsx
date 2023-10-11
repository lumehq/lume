import { Outlet, ScrollRestoration } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { WindowTitlebar } from 'tauri-controls';

import { useStorage } from '@libs/storage/provider';

import { Navigation } from '@shared/navigation';

export function AppLayout() {
  const { db } = useStorage();

  return (
    <div className="flex h-screen w-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      {db.platform !== 'macos' ? <WindowTitlebar /> : <div className="h-11" />}
      <div className="flex h-full min-h-0 w-full">
        <div
          data-tauri-drag-region
          className={twMerge(
            'h-full w-[64px] shrink-0',
            db.platform !== 'macos' ? 'pt-2' : 'pt-16'
          )}
        >
          <Navigation />
        </div>
        <div className="flex h-full min-h-0 flex-1 rounded-tl-lg bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-[inset_0_0_0.5px_1px_hsla(0,0%,100%,0.075),0_0_0_1px_hsla(0,0%,0%,0.05),0_0.3px_0.4px_hsla(0,0%,0%,0.02),0_0.9px_1.5px_hsla(0,0%,0%,0.045),0_3.5px_6px_hsla(0,0%,0%,0.09)]">
          <div className="h-full flex-1">
            <Outlet />
            <ScrollRestoration
              getKey={(location) => {
                return location.pathname;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
