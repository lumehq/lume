import { NavLink, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { useStorage } from '@libs/storage/provider';

import { ActiveAccount } from '@shared/accounts/active';
import { ComposerModal } from '@shared/composer';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatsIcon,
  CommunityIcon,
  ExploreIcon,
  HomeIcon,
  RelayIcon,
} from '@shared/icons';

export function Navigation() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3">
      <div className="flex flex-col gap-5">
        <NavLink
          to="/"
          preventScrollReset={true}
          className="inline-flex flex-col items-center justify-center text-sm font-medium"
        >
          {({ isActive }) => (
            <>
              <div
                className={twMerge(
                  'inline-flex aspect-square h-full w-full items-center justify-center rounded-lg',
                  isActive ? 'bg-black/20 text-white' : 'text-black/50 dark:text-white/50'
                )}
              >
                <HomeIcon className="h-6 w-6" />
              </div>{' '}
              <div
                className={twMerge(
                  '',
                  isActive
                    ? 'text-black dark:text-white'
                    : 'text-black/50 dark:text-white/50'
                )}
              >
                Home
              </div>
            </>
          )}
        </NavLink>
        <NavLink
          to="/chats"
          preventScrollReset={true}
          className="inline-flex flex-col items-center justify-center text-sm font-medium"
        >
          {({ isActive }) => (
            <>
              <div
                className={twMerge(
                  'inline-flex aspect-square h-full w-full items-center justify-center rounded-lg',
                  isActive ? 'bg-black/20 text-white' : 'text-black/50 dark:text-white/50'
                )}
              >
                <ChatsIcon className="h-6 w-6" />
              </div>{' '}
              <div
                className={twMerge(
                  '',
                  isActive
                    ? 'text-black dark:text-white'
                    : 'text-black/50 dark:text-white/50'
                )}
              >
                Chats
              </div>
            </>
          )}
        </NavLink>
        <NavLink
          to="/communities"
          preventScrollReset={true}
          className="inline-flex flex-col items-center justify-center text-sm font-medium"
        >
          {({ isActive }) => (
            <>
              <div
                className={twMerge(
                  'inline-flex aspect-square h-full w-full items-center justify-center rounded-lg',
                  isActive ? 'bg-black/20 text-white' : 'text-black/50 dark:text-white/50'
                )}
              >
                <CommunityIcon className="h-6 w-6" />
              </div>{' '}
              <div
                className={twMerge(
                  '',
                  isActive
                    ? 'text-black dark:text-white'
                    : 'text-black/50 dark:text-white/50'
                )}
              >
                Groups
              </div>
            </>
          )}
        </NavLink>
        <NavLink
          to="/relays"
          preventScrollReset={true}
          className="inline-flex flex-col items-center justify-center text-sm font-medium"
        >
          {({ isActive }) => (
            <>
              <div
                className={twMerge(
                  'inline-flex aspect-square h-full w-full items-center justify-center rounded-lg',
                  isActive ? 'bg-black/20 text-white' : 'text-black/50 dark:text-white/50'
                )}
              >
                <RelayIcon className="h-6 w-6" />
              </div>{' '}
              <div
                className={twMerge(
                  '',
                  isActive
                    ? 'text-black dark:text-white'
                    : 'text-black/50 dark:text-white/50'
                )}
              >
                Relays
              </div>
            </>
          )}
        </NavLink>
        <NavLink
          to="/explore"
          preventScrollReset={true}
          className="inline-flex flex-col items-center justify-center text-sm font-medium"
        >
          {({ isActive }) => (
            <>
              <div
                className={twMerge(
                  'inline-flex aspect-square h-full w-full items-center justify-center rounded-lg',
                  isActive ? 'bg-black/20 text-white' : 'text-black/50 dark:text-white/50'
                )}
              >
                <ExploreIcon className="h-6 w-6" />
              </div>{' '}
              <div
                className={twMerge(
                  '',
                  isActive
                    ? 'text-black dark:text-white'
                    : 'text-black/50 dark:text-white/50'
                )}
              >
                Explore
              </div>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
}
