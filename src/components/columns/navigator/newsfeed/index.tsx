import ActiveLink from '@components/activeLink';

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronUpIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

export default function Newsfeed() {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="flex flex-col px-2">
        <Collapsible.Trigger className="flex cursor-pointer items-center gap-2 rounded-md py-1 px-2 hover:bg-zinc-900">
          <button
            type="button"
            className={`inline-flex h-6 w-6 transform items-center justify-center transition-transform duration-150 ease-in-out ${
              open ? 'rotate-180' : ''
            }`}
          >
            <ChevronUpIcon className="h-4 w-4 text-zinc-500" />
          </button>
          <h3 className="bg-gradient-to-r from-fuchsia-300 via-orange-100 to-amber-300 bg-clip-text text-xs font-bold uppercase tracking-wide text-transparent">
            Newsfeed
          </h3>
        </Collapsible.Trigger>
        <Collapsible.Content className="flex flex-col gap-1 text-zinc-400">
          <ActiveLink
            href={`/newsfeed/following`}
            activeClassName="ring-1 ring-white/10 dark:bg-zinc-900 dark:text-white hover:dark:bg-zinc-800"
            className="flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium hover:bg-zinc-900"
          >
            <div className="inline-flex h-5 w-5 items-center justify-center">
              <span className="h-4 w-3.5 rounded bg-gradient-to-br from-fuchsia-500 via-purple-300 to-pink-300"></span>
            </div>
            <span>Following</span>
          </ActiveLink>
          <ActiveLink
            href={`/newsfeed/circle`}
            activeClassName="ring-1 ring-white/10 dark:bg-zinc-900 dark:text-white hover:dark:bg-zinc-800"
            className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium hover:bg-zinc-900"
          >
            <div className="inline-flex h-5 w-5 items-center justify-center">
              <span className="h-4 w-3.5 rounded bg-gradient-to-br from-amber-500 via-orange-200 to-yellow-300"></span>
            </div>
            <span>Circle</span>
          </ActiveLink>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
