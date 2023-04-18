'use client';

import { ActiveLink } from '@components/activeLink';

import * as Collapsible from '@radix-ui/react-collapsible';
import { Bonfire, NavArrowUp, PeopleTag } from 'iconoir-react';
import { useState } from 'react';

export default function Newsfeed() {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="flex flex-col px-2">
        <Collapsible.Trigger className="flex cursor-pointer items-center gap-1 px-1 py-1">
          <div
            className={`inline-flex h-5 w-5 transform items-center justify-center transition-transform duration-150 ease-in-out ${
              open ? 'rotate-180' : ''
            }`}
          >
            <NavArrowUp width={16} height={16} className="text-zinc-700" />
          </div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Newsfeed</h3>
        </Collapsible.Trigger>
        <Collapsible.Content className="flex flex-col text-zinc-400">
          <ActiveLink
            href="/nostr/newsfeed/following"
            activeClassName="dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800"
            className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium hover:text-zinc-200"
          >
            <PeopleTag width={16} height={16} className="text-zinc-500" />
            <span>Following</span>
          </ActiveLink>
          <ActiveLink
            href="/nostr/newsfeed/circle"
            activeClassName="dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800"
            className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium hover:text-zinc-200"
          >
            <Bonfire width={16} height={16} className="text-zinc-500" />
            <span>Circle</span>
          </ActiveLink>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
