import { Link, NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { ActiveAccount } from '@shared/accounts/active';
import { ChatsIcon, ComposeIcon, HomeIcon, NwcIcon, RelayIcon } from '@shared/icons';
import { compactNumber } from '@utils/formater';

export function Navigation() {
  const newMessages = 0;

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
                    : 'text-black/50 dark:text-neutral-400'
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
                  'relative inline-flex aspect-square h-auto w-full items-center justify-center rounded-lg',
                  isActive
                    ? 'bg-black/10 text-black dark:bg-white/10 dark:text-white'
                    : 'text-black/50 dark:text-neutral-400'
                )}
              >
                <ChatsIcon className="h-6 w-6" />
                {newMessages > 0 ? (
                  <div className="absolute right-0 top-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[9px] font-medium text-white">
                    {compactNumber.format(newMessages)}
                  </div>
                ) : null}
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
                    : 'text-black/50 dark:text-neutral-400'
                )}
              >
                <RelayIcon className="h-6 w-6" />
              </div>
              <div className="text-sm font-medium text-black dark:text-white">Relays</div>
            </>
          )}
        </NavLink>
      </div>
      <div className="flex shrink-0 flex-col gap-3 p-1">
        <Link
          to="/new/"
          className="flex aspect-square h-auto w-full items-center justify-center rounded-lg bg-neutral-100 text-black hover:bg-blue-500 hover:text-white dark:bg-neutral-900 dark:text-white dark:hover:bg-blue-500"
        >
          <ComposeIcon className="h-5 w-5" />
        </Link>
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
