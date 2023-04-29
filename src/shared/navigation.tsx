import ChannelsList from '@lume/app/channel/components/list';
import ChatsList from '@lume/app/chat/components/list';
import ActiveLink from '@lume/shared/activeLink';
import NavArrowDownIcon from '@lume/shared/icons/navArrowDown';

import { Disclosure } from '@headlessui/react';

export default function Navigation() {
  return (
    <div className="relative flex h-full flex-col gap-1 overflow-hidden pt-3">
      {/* Newsfeed */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="flex flex-col px-2">
            <Disclosure.Button className="flex cursor-pointer items-center gap-1 px-1 py-1">
              <div
                className={`inline-flex h-5 w-5 transform items-center justify-center transition-transform duration-150 ease-in-out ${
                  open ? '' : 'rotate-180'
                }`}
              >
                <NavArrowDownIcon width={12} height={12} className="text-zinc-700" />
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Newsfeed</h3>
            </Disclosure.Button>
            <Disclosure.Panel className="flex flex-col text-zinc-400">
              <ActiveLink
                href="/app/newsfeed/following"
                className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium hover:text-zinc-200"
                activeClassName="dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800"
              >
                <span>#</span>
                <span>Following</span>
              </ActiveLink>
              <ActiveLink
                href="/app/newsfeed/circle"
                className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium hover:text-zinc-200"
                activeClassName="dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800"
              >
                <span>#</span>
                <span>Circle</span>
              </ActiveLink>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
      {/* Channels */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="flex flex-col px-2">
            <Disclosure.Button className="flex cursor-pointer items-center gap-1 px-1 py-1">
              <div
                className={`inline-flex h-5 w-5 transform items-center justify-center transition-transform duration-150 ease-in-out ${
                  open ? '' : 'rotate-180'
                }`}
              >
                <NavArrowDownIcon width={12} height={12} className="text-zinc-700" />
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Channels</h3>
            </Disclosure.Button>
            <Disclosure.Panel>
              <ChannelsList />
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
      {/* Chats */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="flex flex-col px-2">
            <Disclosure.Button className="flex cursor-pointer items-center gap-1 px-1 py-1">
              <div
                className={`inline-flex h-5 w-5 transform items-center justify-center transition-transform duration-150 ease-in-out ${
                  open ? '' : 'rotate-180'
                }`}
              >
                <NavArrowDownIcon width={12} height={12} className="text-zinc-700" />
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Chats</h3>
            </Disclosure.Button>
            <Disclosure.Panel>
              <ChatsList />
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  );
}
