import * as Collapsible from '@radix-ui/react-collapsible';
import { NavLink, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { ChatsList } from '@app/chats/components/list';

import { ComposerModal } from '@shared/composer/modal';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  NavArrowDownIcon,
  SpaceIcon,
} from '@shared/icons';
import { LumeBar } from '@shared/lumeBar';

import { useSidebar } from '@stores/sidebar';

export function Navigation() {
  const navigate = useNavigate();

  const [feeds, toggleFeeds] = useSidebar((state) => [state.feeds, state.toggleFeeds]);
  const [chats, toggleChats] = useSidebar((state) => [state.chats, state.toggleChats]);

  return (
    <div className="relative h-full w-[232px] bg-black/80">
      <div className="absolute left-0 top-0 h-8 w-full" data-tauri-drag-region />
      <div className="scrollbar-hide flex flex-col gap-5 overflow-y-auto pb-20">
        <div className="inline-flex h-8 items-center justify-between px-2 pb-4 pt-14">
          <ComposerModal />
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group inline-flex h-8 w-8 items-center justify-center rounded hover:bg-white/10"
            >
              <ArrowLeftIcon className="h-5 w-5 text-white/50 group-hover:text-white" />
            </button>
            <button
              type="button"
              onClick={() => navigate(1)}
              className="group inline-flex h-8 w-8 items-center justify-center rounded hover:bg-white/10"
            >
              <ArrowRightIcon className="h-5 w-5 text-white/50 group-hover:text-white" />
            </button>
          </div>
        </div>
        <Collapsible.Root open={feeds} onOpenChange={toggleFeeds}>
          <div className="flex flex-col gap-1 px-2">
            <Collapsible.Trigger asChild>
              <button className="flex items-center gap-1">
                <div
                  className={twMerge(
                    'inline-flex h-5 w-5 transform items-center justify-center transition-transform duration-150 ease-in-out',
                    open ? '' : 'rotate-180'
                  )}
                >
                  <NavArrowDownIcon
                    className={twMerge(
                      'h-3 w-3 text-white/50',
                      feeds ? '' : 'rotate-180'
                    )}
                  />
                </div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/50">
                  Personal
                </h3>
              </button>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div className="flex flex-col">
                <NavLink
                  to="/"
                  preventScrollReset={true}
                  className={({ isActive }) =>
                    twMerge(
                      'flex h-9 items-center gap-2.5 rounded-md px-2',
                      isActive ? 'bg-white/10 text-white' : 'text-white/80'
                    )
                  }
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-white/10">
                    <SpaceIcon className="h-3 w-3 text-white" />
                  </span>
                  Space
                </NavLink>
                <NavLink
                  to="/notifications"
                  preventScrollReset={true}
                  className={({ isActive }) =>
                    twMerge(
                      'flex h-9 items-center gap-2.5 rounded-md px-2',
                      isActive ? 'bg-white/10 text-white' : 'text-white/80'
                    )
                  }
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-white/10">
                    <BellIcon className="h-3 w-3 text-white" />
                  </span>
                  Notifications
                </NavLink>
              </div>
            </Collapsible.Content>
          </div>
        </Collapsible.Root>
        <Collapsible.Root open={chats} onOpenChange={toggleChats}>
          <div className="flex flex-col gap-1 px-2">
            <Collapsible.Trigger asChild>
              <button className="flex items-center gap-1">
                <div
                  className={twMerge(
                    'inline-flex h-5 w-5 transform items-center justify-center transition-transform duration-150 ease-in-out',
                    chats ? '' : 'rotate-180'
                  )}
                >
                  <NavArrowDownIcon className="h-3 w-3 text-white/50" />
                </div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/50">
                  Chats
                </h3>
              </button>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <ChatsList />
            </Collapsible.Content>
          </div>
        </Collapsible.Root>
      </div>
      <LumeBar />
    </div>
  );
}
