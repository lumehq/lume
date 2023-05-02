import ChannelsList from '@lume/app/channel/components/list';
import ChatsList from '@lume/app/chat/components/list';
import ActiveLink from '@lume/shared/activeLink';
import MyspaceIcon from '@lume/shared/icons/myspace';
import NavArrowDownIcon from '@lume/shared/icons/navArrowDown';
import ThreadsIcon from '@lume/shared/icons/threads';
import WorldIcon from '@lume/shared/icons/world';

import { Disclosure } from '@headlessui/react';

export default function Navigation() {
  return (
    <div className="relative flex h-full flex-col gap-3 overflow-hidden pt-3">
      {/* Newsfeed */}
      <div className="flex flex-col gap-0.5 px-1.5">
        <div className="px-2.5">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Feeds</h3>
        </div>
        <div className="flex flex-col text-zinc-400">
          <ActiveLink
            href="/app/newsfeed/following"
            className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-semibold hover:text-zinc-200"
            activeClassName=""
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-zinc-900">
              <WorldIcon width={12} height={12} className="text-zinc-200" />
            </span>
            <span>Daily</span>
          </ActiveLink>
          <ActiveLink
            href="/app/threads"
            className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-semibold hover:text-zinc-200"
            activeClassName=""
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-zinc-900">
              <ThreadsIcon width={12} height={12} className="text-zinc-200" />
            </span>
            <span>Threads</span>
          </ActiveLink>
          <ActiveLink
            href="/app/myspace"
            className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-semibold hover:text-zinc-200"
            activeClassName=""
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-zinc-900">
              <MyspaceIcon width={12} height={12} className="text-zinc-200" />
            </span>
            <span>MySpace</span>
          </ActiveLink>
        </div>
      </div>
      {/* Channels */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="flex flex-col gap-0.5 px-1.5">
            <Disclosure.Button className="flex cursor-pointer items-center gap-1 px-2.5">
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
          <div className="flex flex-col gap-0.5 px-1.5">
            <Disclosure.Button className="flex cursor-pointer items-center gap-1 px-2.5">
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
