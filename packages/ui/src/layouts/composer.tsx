import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export function ComposerLayout() {
  const location = useLocation();

  return (
    <div className="container mx-auto h-full px-8 pt-8">
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
  );
}
