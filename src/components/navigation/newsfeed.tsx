import ActiveLink from '@components/activeLink';

import * as Collapsible from '@radix-ui/react-collapsible';
import { TriangleUpIcon } from '@radix-ui/react-icons';
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
            <TriangleUpIcon className="h-4 w-4 text-zinc-700" />
          </div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Newsfeed</h3>
        </Collapsible.Trigger>
        <Collapsible.Content className="flex flex-col text-zinc-400">
          <ActiveLink
            href={`/newsfeed/following`}
            activeClassName="dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800"
            className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium hover:text-zinc-200"
          >
            <span>Following</span>
          </ActiveLink>
          <ActiveLink
            href={`/newsfeed/circle`}
            activeClassName="dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800"
            className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium hover:text-zinc-200"
          >
            <span>Circle</span>
          </ActiveLink>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
