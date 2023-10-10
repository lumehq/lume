import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { ArrowLeftIcon, SecureIcon, SettingsIcon } from '@shared/icons';

export function SettingsLayout() {
  return (
    <div className="flex h-screen w-screen">
      <div className="relative flex h-full w-[232px] flex-col">
        <div data-tauri-drag-region className="h-11 w-full shrink-0" />
        <div className="flex h-full flex-1 flex-col gap-2 overflow-y-auto pb-32 scrollbar-none">
          <div className="inline-flex items-center gap-2 border-l-2 border-transparent pl-4">
            <Link
              to="/"
              className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"
            >
              <ArrowLeftIcon className="h-4 w-4 text-white/50" />
            </Link>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/50">
              Settings
            </h3>
          </div>
          <div className="flex flex-col pr-2">
            <NavLink
              to="/settings/"
              className={({ isActive }) =>
                twMerge(
                  'flex h-10 items-center gap-2.5 rounded-r-lg border-l-2 pl-4 pr-2',
                  isActive
                    ? 'border-blue-500 bg-white/5 text-white'
                    : 'border-transparent text-white/80'
                )
              }
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
                <SettingsIcon className="h-4 w-4 text-white" />
              </span>
              <span className="font-medium">General</span>
            </NavLink>
            <NavLink
              to="/settings/backup"
              className={({ isActive }) =>
                twMerge(
                  'flex h-10 items-center gap-2.5 rounded-r-lg border-l-2 pl-4 pr-2',
                  isActive
                    ? 'border-blue-500 bg-white/5 text-white'
                    : 'border-transparent text-white/80'
                )
              }
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
                <SecureIcon className="h-4 w-4 text-white" />
              </span>
              <span className="font-medium">Backup</span>
            </NavLink>
          </div>
        </div>
      </div>
      <div className="h-full w-full flex-1 bg-black/90 backdrop-blur-xl">
        <Outlet />
        <ScrollRestoration
          getKey={(location) => {
            return location.pathname;
          }}
        />
      </div>
    </div>
  );
}
