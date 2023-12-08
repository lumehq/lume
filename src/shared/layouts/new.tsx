import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { WindowTitlebar } from 'tauri-controls';

import { useArk } from '@libs/ark';

import { ArrowLeftIcon } from '@shared/icons';

export function NewLayout() {
  const { ark } = useArk();
  const location = useLocation();

  return (
    <div className="flex h-screen w-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      {ark.platform !== 'macos' ? (
        <WindowTitlebar />
      ) : (
        <div data-tauri-drag-region className="h-9 shrink-0" />
      )}
      <div data-tauri-drag-region className="h-4 shrink-0" />
      <div className="container mx-auto grid flex-1 grid-cols-8 px-4">
        <div className="col-span-1">
          <Link
            to="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
        </div>
        <div className="col-span-6 flex flex-col">
          <div className="mb-8 flex h-10 shrink-0 items-center gap-3">
            {location.pathname !== '/new/privkey' ? (
              <div className="flex h-10 items-center gap-2 rounded-lg bg-neutral-100 px-0.5 dark:bg-neutral-800">
                <NavLink
                  to="/new/"
                  end
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
            ) : null}
          </div>
          <Outlet />
        </div>
        <div className="col-span-1" />
      </div>
    </div>
  );
}
