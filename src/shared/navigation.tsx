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
  const { db } = useStorage();
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full w-[232px] flex-col border-r border-zinc-200 dark:border-zinc-800">
      <div
        data-tauri-drag-region
        className="inline-flex h-16 w-full items-center justify-between px-3"
      >
        <div className="inline-flex items-center gap-4 pl-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-9 items-center justify-center text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-100"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => navigate(1)}
            className="inline-flex h-9 items-center justify-center text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-100"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
        <ComposerModal />
      </div>
      <div
        data-tauri-drag-region
        className="scrollbar-hide flex h-full flex-1 flex-col gap-6 overflow-y-auto pr-3"
      >
        <div className="flex flex-col">
          <NavLink
            to="/"
            preventScrollReset={true}
            className={({ isActive }) =>
              twMerge(
                'flex h-10 items-center gap-2.5 rounded-r-lg border-l-2 px-3 font-medium',
                isActive
                  ? 'border-interor-600 bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100'
                  : 'border-transparent text-zinc-500 dark:text-zinc-500'
              )
            }
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center">
              <HomeIcon className="h-5 w-5" />
            </span>
            Home
          </NavLink>
          <NavLink
            to="/chats"
            preventScrollReset={true}
            className={({ isActive }) =>
              twMerge(
                'flex h-10 items-center gap-2.5 rounded-r-lg border-l-2 px-3 font-medium',
                isActive
                  ? 'border-interor-600 bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100'
                  : 'border-transparent text-zinc-500 dark:text-zinc-500'
              )
            }
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center">
              <ChatsIcon className="h-5 w-5" />
            </span>
            Chats
          </NavLink>
          <NavLink
            to="/communities"
            preventScrollReset={true}
            className={({ isActive }) =>
              twMerge(
                'flex h-10 items-center gap-2.5 rounded-r-lg border-l-2 px-3 font-medium',
                isActive
                  ? 'border-interor-600 bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100'
                  : 'border-transparent text-zinc-500 dark:text-zinc-500'
              )
            }
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center">
              <CommunityIcon className="h-5 w-5" />
            </span>
            Communities
          </NavLink>
          <NavLink
            to="/relays"
            preventScrollReset={true}
            className={({ isActive }) =>
              twMerge(
                'flex h-10 items-center gap-2.5 rounded-r-lg border-l-2 px-3 font-medium',
                isActive
                  ? 'border-interor-600 bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100'
                  : 'border-transparent text-zinc-500 dark:text-zinc-500'
              )
            }
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center">
              <RelayIcon className="h-5 w-5" />
            </span>
            Relays
          </NavLink>
          <NavLink
            to="/explore"
            preventScrollReset={true}
            className={({ isActive }) =>
              twMerge(
                'flex h-10 items-center gap-2.5 rounded-r-lg border-l-2 px-3 font-medium',
                isActive
                  ? 'border-interor-600 bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100'
                  : 'border-transparent text-zinc-500 dark:text-zinc-500'
              )
            }
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center">
              <ExploreIcon className="h-5 w-5" />
            </span>
            Explore
          </NavLink>
        </div>
      </div>
      <div className="relative shrink-0">
        <ActiveAccount />
      </div>
    </div>
  );
}
