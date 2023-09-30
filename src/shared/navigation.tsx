import * as Collapsible from '@radix-ui/react-collapsible';
import { NavLink, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { ChatsList } from '@app/chats/components/list';

import { useStorage } from '@libs/storage/provider';

import { ActiveAccount } from '@shared/accounts/active';
import { ComposerModal } from '@shared/composer';
import { Frame } from '@shared/frame';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  NavArrowDownIcon,
  NwcIcon,
  SpaceIcon,
  WorldIcon,
} from '@shared/icons';

import { useActivities } from '@stores/activities';
import { useSidebar } from '@stores/sidebar';

import { compactNumber } from '@utils/number';

export function Navigation() {
  const { db } = useStorage();

  const navigate = useNavigate();
  const totalNewActivities = useActivities((state) => state.totalNewActivities);

  const [chats, toggleChats] = useSidebar((state) => [state.chats, state.toggleChats]);
  const [integrations, toggleIntegrations] = useSidebar((state) => [
    state.integrations,
    state.toggleIntegrations,
  ]);

  return (
    <Frame
      className="relative flex h-full w-[232px] flex-col border-r border-white/5"
      lighter
    >
      <div
        data-tauri-drag-region
        className="inline-flex h-16 w-full items-center justify-between px-3"
      >
        {db.platform !== 'darwin' ? (
          <div className="inline-flex items-center gap-4 pl-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 items-center justify-center"
            >
              <ArrowLeftIcon className="h-5 w-5 text-white/50" />
            </button>
            <button
              type="button"
              onClick={() => navigate(1)}
              className="inline-flex h-9 items-center justify-center"
            >
              <ArrowRightIcon className="h-5 w-5 text-white/50" />
            </button>
          </div>
        ) : (
          <div />
        )}
        <ComposerModal />
      </div>
      <div
        data-tauri-drag-region
        className="scrollbar-hide flex h-full flex-1 flex-col gap-6 overflow-y-auto pb-32"
      >
        <div className="flex flex-col pr-3">
          <NavLink
            to="/"
            preventScrollReset={true}
            className={({ isActive }) =>
              twMerge(
                'flex h-10 items-center gap-2.5 rounded-r-lg border-l-2 pl-4 pr-3',
                isActive
                  ? 'border-fuchsia-500 bg-white/5 text-white'
                  : 'border-transparent text-white/70'
              )
            }
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
              <SpaceIcon className="h-4 w-4 text-white" />
            </span>
            Home
          </NavLink>
          <NavLink
            to="/relays"
            preventScrollReset={true}
            className={({ isActive }) =>
              twMerge(
                'flex h-10 items-center gap-2.5 rounded-r-lg border-l-2 pl-4 pr-3',
                isActive
                  ? 'border-fuchsia-500 bg-white/5 text-white'
                  : 'border-transparent text-white/70'
              )
            }
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
              <WorldIcon className="h-4 w-4 text-white" />
            </span>
            Relays
          </NavLink>
          <NavLink
            to="/explore"
            preventScrollReset={true}
            className={({ isActive }) =>
              twMerge(
                'flex h-10 items-center gap-2.5 rounded-r-lg border-l-2 pl-4 pr-3',
                isActive
                  ? 'border-fuchsia-500 bg-white/5 text-white'
                  : 'border-transparent text-white/70'
              )
            }
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
              <WorldIcon className="h-4 w-4 text-white" />
            </span>
            Explore
          </NavLink>
          <NavLink
            to="/notifications"
            preventScrollReset={true}
            className={({ isActive }) =>
              twMerge(
                'flex h-10 items-center justify-between rounded-r-lg border-l-2 pl-4 pr-3',
                isActive
                  ? 'border-fuchsia-500 bg-white/5 text-white'
                  : 'border-transparent text-white/70'
              )
            }
          >
            <div className="flex items-center gap-2.5">
              {totalNewActivities > 0 ? (
                <div className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded bg-fuchsia-500/20 backdrop-blur-xl">
                  <p className="text-sm font-bold text-fuchsia-500">
                    {compactNumber.format(totalNewActivities)}
                  </p>
                  <span className="absolute right-0 top-0 block h-1 w-1 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-fuchsia-500 ring-2 ring-black/80" />
                </div>
              ) : (
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
                  <BellIcon className="h-4 w-4 text-white" />
                </span>
              )}
              Notifications
            </div>
          </NavLink>
        </div>
        <Collapsible.Root open={integrations} onOpenChange={toggleIntegrations}>
          <div className="flex flex-col gap-1 pr-3">
            <Collapsible.Trigger asChild>
              <button className="flex items-center gap-1 pl-[20px] pr-4">
                <div
                  className={twMerge(
                    'inline-flex h-5 w-5 transform items-center justify-center transition-transform duration-150 ease-in-out',
                    integrations ? '' : 'rotate-180'
                  )}
                >
                  <NavArrowDownIcon className="h-3 w-3 text-white/50" />
                </div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/50">
                  Integrations
                </h3>
              </button>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <NavLink
                to="/nwc"
                preventScrollReset={true}
                className={({ isActive }) =>
                  twMerge(
                    'flex h-10 items-center gap-2.5 rounded-r-lg border-l-2 pl-4 pr-3',
                    isActive
                      ? 'border-fuchsia-500 bg-white/5 text-white'
                      : 'border-transparent text-white/70'
                  )
                }
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/10 backdrop-blur-xl">
                  <NwcIcon className="h-4 w-4 text-white" />
                </span>
                Wallet Connect
              </NavLink>
            </Collapsible.Content>
          </div>
        </Collapsible.Root>
        <Collapsible.Root open={chats} onOpenChange={toggleChats}>
          <div className="flex flex-col gap-1 pr-3">
            <Collapsible.Trigger asChild>
              <button className="flex items-center gap-1 pl-[20px] pr-4">
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
      <div className="relative shrink-0">
        <ActiveAccount />
      </div>
    </Frame>
  );
}
