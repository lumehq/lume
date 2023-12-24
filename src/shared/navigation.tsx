import { Link, NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { ActiveAccount } from '@shared/account/active';
import {
  DepotIcon,
  HomeIcon,
  NwcIcon,
  PlusIcon,
  RelayIcon,
  SearchIcon,
} from '@shared/icons';

export function Navigation() {
  return (
    <div className="flex h-full w-20 shrink-0 flex-col justify-between px-4 py-3">
      <div className="flex flex-1 flex-col gap-5">
        <NavLink
          to="/"
          preventScrollReset={true}
          className="inline-flex flex-col items-center justify-center"
        >
          {({ isActive }) => (
            <>
              <div
                className={twMerge(
                  'inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl',
                  isActive
                    ? 'bg-black/10 text-black dark:bg-white/10 dark:text-white'
                    : 'text-black/50 dark:text-neutral-400'
                )}
              >
                <HomeIcon className="h-6 w-6" />
              </div>
              <div
                className={twMerge(
                  'text-sm',
                  isActive
                    ? 'font-semibold text-black dark:text-white'
                    : 'font-medium text-black/50 dark:text-white/50'
                )}
              >
                Home
              </div>
            </>
          )}
        </NavLink>
        <NavLink
          to="/relays"
          preventScrollReset={true}
          className="inline-flex flex-col items-center justify-center"
        >
          {({ isActive }) => (
            <>
              <div
                className={twMerge(
                  'inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl',
                  isActive
                    ? 'bg-black/10 text-black dark:bg-white/10 dark:text-white'
                    : 'text-black/50 dark:text-neutral-400'
                )}
              >
                <RelayIcon className="h-6 w-6" />
              </div>
              <div
                className={twMerge(
                  'text-sm',
                  isActive
                    ? 'font-semibold text-black dark:text-white'
                    : 'font-medium text-black/50 dark:text-white/50'
                )}
              >
                Relays
              </div>
            </>
          )}
        </NavLink>
        <NavLink
          to="/depot"
          preventScrollReset={true}
          className="inline-flex flex-col items-center justify-center"
        >
          {({ isActive }) => (
            <>
              <div
                className={twMerge(
                  'inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl',
                  isActive
                    ? 'bg-black/10 text-black dark:bg-white/10 dark:text-white'
                    : 'text-black/50 dark:text-neutral-400'
                )}
              >
                <DepotIcon className="h-6 w-6" />
              </div>
              <div
                className={twMerge(
                  'text-sm',
                  isActive
                    ? 'font-semibold text-black dark:text-white'
                    : 'font-medium text-black/50 dark:text-white/50'
                )}
              >
                Depot
              </div>
            </>
          )}
        </NavLink>
        <NavLink
          to="/nwc"
          preventScrollReset={true}
          className="inline-flex flex-col items-center justify-center"
        >
          {({ isActive }) => (
            <>
              <div
                className={twMerge(
                  'inline-flex aspect-square h-auto w-full items-center justify-center rounded-xl',
                  isActive
                    ? 'bg-black/10 text-black dark:bg-white/10 dark:text-white'
                    : 'text-black/50 dark:text-neutral-400'
                )}
              >
                <NwcIcon className="h-6 w-6" />
              </div>
              <div
                className={twMerge(
                  'text-sm',
                  isActive
                    ? 'font-semibold text-black dark:text-white'
                    : 'font-medium text-black/50 dark:text-white/50'
                )}
              >
                Wallet
              </div>
            </>
          )}
        </NavLink>
      </div>
      <div className="flex shrink-0 flex-col gap-3 p-1">
        <Link
          to="/new/"
          className="flex aspect-square h-auto w-full items-center justify-center rounded-xl bg-black/10 text-black hover:bg-blue-500 hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-blue-500"
        >
          <PlusIcon className="h-5 w-5" />
        </Link>
        <Link
          to="/nwc"
          className="flex aspect-square h-auto w-full items-center justify-center rounded-xl bg-black/10 hover:bg-blue-500 hover:text-white dark:bg-white/10 dark:hover:bg-blue-500"
        >
          <SearchIcon className="h-5 w-5" />
        </Link>
        <ActiveAccount />
      </div>
    </div>
  );
}
