import { NavLink, Outlet } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { DotsPattern } from '@shared/icons';

export function BrowseScreen() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 right-0 top-4 z-30 flex w-full items-center justify-between px-3">
        <div className="w-10" />
        <div className="inline-flex gap-1 rounded-full border-t border-white/10 bg-white/20 p-1 backdrop-blur-xl">
          <NavLink
            to="/browse/"
            className={({ isActive }) =>
              twMerge(
                'inline-flex h-8 w-20 items-center justify-center rounded-full text-sm font-semibold',
                isActive ? 'bg-white/10 hover:bg-white/20' : ' hover:bg-white/5'
              )
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/browse/relays"
            className={({ isActive }) =>
              twMerge(
                'inline-flex h-8 w-20 items-center justify-center rounded-full text-sm font-semibold',
                isActive ? 'bg-white/10 hover:bg-white/20' : ' hover:bg-white/5'
              )
            }
          >
            Relays
          </NavLink>
        </div>
        <div className="w-10" />
      </div>
      <div className="absolute z-10 h-full w-full">
        <DotsPattern className="h-full w-full text-white/10" />
      </div>
      <div className="relative z-20">
        <Outlet />
      </div>
    </div>
  );
}
