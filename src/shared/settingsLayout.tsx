import { NavLink, Outlet, ScrollRestoration } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { AppHeader } from '@shared/appHeader';

export function SettingsLayout() {
  return (
    <div className="flex h-screen w-screen">
      <div className="relative flex shrink-0 flex-row">
        <div className="relative flex w-[232px] flex-col gap-3 border-r border-zinc-900">
          <AppHeader />
          <div className="scrollbar-hide flex flex-col gap-5 overflow-y-auto pb-20">
            <div className="flex flex-col gap-0.5 px-1.5">
              <div className="px-2.5">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                  Settings
                </h3>
              </div>
              <div className="flex flex-col">
                <NavLink
                  to="/settings/general"
                  className={({ isActive }) =>
                    twMerge(
                      'flex h-9 items-center gap-2.5 rounded-md px-2.5 text-zinc-200',
                      isActive ? 'bg-zinc-900/50' : ''
                    )
                  }
                >
                  <span className="font-medium">General</span>
                </NavLink>
                <NavLink
                  to="/settings/shortcuts"
                  className={({ isActive }) =>
                    twMerge(
                      'flex h-9 items-center gap-2.5 rounded-md px-2.5 text-zinc-200',
                      isActive ? 'bg-zinc-900/50' : ''
                    )
                  }
                >
                  <span className="font-medium">Shortcuts</span>
                </NavLink>
                <NavLink
                  to="/settings/account"
                  className={({ isActive }) =>
                    twMerge(
                      'flex h-9 items-center gap-2.5 rounded-md px-2.5 text-zinc-200',
                      isActive ? 'bg-zinc-900/50' : ''
                    )
                  }
                >
                  <span className="font-medium">Account</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full w-full">
        <Outlet />
        <ScrollRestoration />
      </div>
    </div>
  );
}
