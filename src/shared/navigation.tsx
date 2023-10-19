import { Link, NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { ActiveAccount } from '@shared/accounts/active';
import { ComposerModal } from '@shared/composer';
import { ChatsIcon, ExploreIcon, HomeIcon, NwcIcon, RelayIcon } from '@shared/icons';

export function Navigation() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3">
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
                  'inline-flex aspect-square h-auto w-full items-center justify-center rounded-lg',
                  isActive
                    ? 'bg-black/10 text-black dark:bg-white/10 dark:text-white'
                    : 'text-black/50 dark:text-neutral-400 dark:text-neutral-600'
                )}
              >
                <HomeIcon className="h-6 w-6" />
              </div>
              <div className="text-sm font-medium text-black dark:text-white">Home</div>
            </>
          )}
        </NavLink>
        <NavLink
          to="/chats"
          preventScrollReset={true}
          className="inline-flex flex-col items-center justify-center"
        >
          {({ isActive }) => (
            <>
              <div
                className={twMerge(
                  'inline-flex aspect-square h-auto w-full items-center justify-center rounded-lg',
                  isActive
                    ? 'bg-black/10 text-black dark:bg-white/10 dark:text-white'
                    : 'text-black/50 dark:text-neutral-400 dark:text-neutral-600'
                )}
              >
                <ChatsIcon className="h-6 w-6" />
              </div>
              <div className="text-sm font-medium text-black dark:text-white">Chats</div>
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
                  'inline-flex aspect-square h-auto w-full items-center justify-center rounded-lg',
                  isActive
                    ? 'bg-black/10 text-black dark:bg-white/10 dark:text-white'
                    : 'text-black/50 dark:text-neutral-400 dark:text-neutral-600'
                )}
              >
                <RelayIcon className="h-6 w-6" />
              </div>
              <div className="text-sm font-medium text-black dark:text-white">Relays</div>
            </>
          )}
        </NavLink>
        <NavLink
          to="/explore"
          preventScrollReset={true}
          className="inline-flex flex-col items-center justify-center"
        >
          {({ isActive }) => (
            <>
              <div
                className={twMerge(
                  'inline-flex aspect-square h-auto w-full items-center justify-center rounded-lg',
                  isActive
                    ? 'bg-black/10 text-black dark:bg-white/10 dark:text-white'
                    : 'text-black/50 dark:text-neutral-400 dark:text-neutral-600'
                )}
              >
                <ExploreIcon className="h-6 w-6" />
              </div>
              <div className="text-sm font-medium text-black dark:text-white">
                Explore
              </div>
            </>
          )}
        </NavLink>
      </div>
      <div className="flex shrink-0 flex-col gap-3 p-1">
        <ComposerModal />
        <Link
          to="/nwc"
          className="flex aspect-square h-auto w-full items-center justify-center rounded-lg bg-neutral-100 hover:bg-blue-500 hover:text-white dark:bg-neutral-900 dark:hover:bg-blue-500"
        >
          <NwcIcon className="h-5 w-5" />
        </Link>
        <ActiveAccount />
      </div>
    </div>
  );
}
