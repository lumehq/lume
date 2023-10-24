import { Link, NavLink, Outlet } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { WindowTitlebar } from 'tauri-controls';

import { useStorage } from '@libs/storage/provider';

import { ArrowLeftIcon } from '@shared/icons';

export function NewScreen() {
  const { db } = useStorage();

  return (
    <div className="flex h-screen w-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      {db.platform !== 'macos' ? (
        <WindowTitlebar />
      ) : (
        <div data-tauri-drag-region className="h-9" />
      )}
      <div data-tauri-drag-region className="h-6" />
      <div className="flex h-full min-h-0 w-full">
        <div className="container mx-auto grid grid-cols-8 px-4">
          <div className="col-span-1">
            <Link
              to="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
          </div>
          <div className="relative col-span-6 flex flex-col">
            <div className="mb-8 flex h-10 shrink-0 items-center gap-3">
              <div className="flex h-10 items-center gap-2 rounded-lg bg-neutral-100 px-0.5 dark:bg-neutral-800">
                <NavLink
                  to="/new/"
                  className={({ isActive }) =>
                    twMerge(
                      'inline-flex h-9 w-20 items-center justify-center rounded-lg text-sm font-medium',
                      isActive ? 'bg-white shadow dark:bg-black' : 'bg-transparent'
                    )
                  }
                >
                  Post
                </NavLink>
                <NavLink
                  to="/new/article"
                  className={({ isActive }) =>
                    twMerge(
                      'inline-flex h-9 w-20 items-center justify-center rounded-lg text-sm font-medium',
                      isActive ? 'bg-white shadow dark:bg-black' : 'bg-transparent'
                    )
                  }
                >
                  Article
                </NavLink>
                <NavLink
                  to="/new/file"
                  className={({ isActive }) =>
                    twMerge(
                      'inline-flex h-9 w-28 items-center justify-center rounded-lg text-sm font-medium',
                      isActive ? 'bg-white shadow dark:bg-black' : 'bg-transparent'
                    )
                  }
                >
                  File Sharing
                </NavLink>
              </div>
            </div>
            <div className="h-full min-h-0 w-full">
              <Outlet />
            </div>
          </div>
          <div className="col-span-1" />
        </div>
      </div>
    </div>
  );
}
