import ActiveLink from '@components/activeLink';
import ChannelList from '@components/channels/channelList';
import ChatList from '@components/chats/chatList';

import { Disclosure } from '@headlessui/react';
import { Bonfire, NavArrowUp, PeopleTag } from 'iconoir-react';
import { Suspense } from 'react';
import Skeleton from 'react-loading-skeleton';

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
                  open ? 'rotate-180' : ''
                }`}
              >
                <NavArrowUp width={16} height={16} className="text-zinc-700" />
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Newsfeed</h3>
            </Disclosure.Button>
            <Disclosure.Panel className="flex flex-col text-zinc-400">
              <ActiveLink
                href="/newsfeed/following"
                className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium hover:text-zinc-200"
                activeClassName="dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800"
              >
                <PeopleTag width={16} height={16} className="text-zinc-500" />
                <span>Following</span>
              </ActiveLink>
              <ActiveLink
                href="/newsfeed/circle"
                className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium hover:text-zinc-200"
                activeClassName="dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800"
              >
                <Bonfire width={16} height={16} className="text-zinc-500" />
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
                  open ? 'rotate-180' : ''
                }`}
              >
                <NavArrowUp width={16} height={16} className="text-zinc-700" />
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Channels</h3>
            </Disclosure.Button>
            <Disclosure.Panel>
              <Suspense fallback={<Skeleton count={2} />}>
                <ChannelList />
              </Suspense>
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
                  open ? 'rotate-180' : ''
                }`}
              >
                <NavArrowUp width={16} height={16} className="text-zinc-700" />
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Chats</h3>
            </Disclosure.Button>
            <Disclosure.Panel>
              <ChatList />
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  );
}
