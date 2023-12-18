import { Platform } from '@tauri-apps/plugin-os';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import {
  AdvancedSettingsIcon,
  ArrowLeftIcon,
  InfoIcon,
  SecureIcon,
  SettingsIcon,
  UserIcon,
} from '@shared/icons';
import { WindowTitleBar } from '@shared/titlebar';

export function SettingsLayout({ platform }: { platform: Platform }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      {platform !== 'macos' ? (
        <WindowTitleBar platform={platform} />
      ) : (
        <div data-tauri-drag-region className="h-9 shrink-0" />
      )}
      <div className="flex h-full min-h-0 w-full flex-col gap-8 overflow-y-auto">
        <div className="flex h-20 w-full items-center justify-between border-b border-neutral-200 px-2 pb-2 dark:border-neutral-900">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-0.5">
            <NavLink
              to="/settings/"
              end
              className={({ isActive }) =>
                twMerge(
                  'flex w-20 shrink-0 flex-col items-center justify-center rounded-lg px-2 py-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900',
                  isActive
                    ? 'bg-neutral-50 text-blue-500 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-900'
                    : ''
                )
              }
            >
              <UserIcon className="h-6 w-6" />
              <p className="text-sm font-medium">User</p>
            </NavLink>
            <NavLink
              to="/settings/general"
              className={({ isActive }) =>
                twMerge(
                  'flex w-20 shrink-0 flex-col items-center justify-center rounded-lg px-2 py-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900',
                  isActive
                    ? 'bg-neutral-50 text-blue-500 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-900'
                    : ''
                )
              }
            >
              <SettingsIcon className="h-6 w-6" />
              <p className="text-sm font-medium">General</p>
            </NavLink>
            <NavLink
              to="/settings/backup"
              className={({ isActive }) =>
                twMerge(
                  'flex w-20 shrink-0 flex-col items-center justify-center rounded-lg px-2 py-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900',
                  isActive
                    ? 'bg-neutral-50 text-blue-500 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-900'
                    : ''
                )
              }
            >
              <SecureIcon className="h-6 w-6" />
              <p className="text-sm font-medium">Backup</p>
            </NavLink>
            <NavLink
              to="/settings/advanced"
              className={({ isActive }) =>
                twMerge(
                  'flex w-20 shrink-0 flex-col items-center justify-center rounded-lg px-2 py-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900',
                  isActive
                    ? 'bg-neutral-50 text-blue-500 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-900'
                    : ''
                )
              }
            >
              <AdvancedSettingsIcon className="h-6 w-6" />
              <p className="text-sm font-medium">Advanced</p>
            </NavLink>
            <NavLink
              to="/settings/about"
              className={({ isActive }) =>
                twMerge(
                  'flex w-20 shrink-0 flex-col items-center justify-center rounded-lg px-2 py-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900',
                  isActive
                    ? 'bg-neutral-50 text-blue-500 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-900'
                    : ''
                )
              }
            >
              <InfoIcon className="h-6 w-6" />
              <p className="text-sm font-medium">About</p>
            </NavLink>
          </div>
          <div />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
