import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tooltip from '@radix-ui/react-tooltip';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { nip19 } from 'nostr-tools';
import { EventPointer } from 'nostr-tools/lib/nip19';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { HorizontalDotsIcon } from '@shared/icons';

export function MoreActions({ id, pubkey }: { id: string; pubkey: string }) {
  const [open, setOpen] = useState(false);

  const copyID = async () => {
    await writeText(nip19.neventEncode({ id: id, author: pubkey } as EventPointer));
    setOpen(false);
  };

  const copyLink = async () => {
    await writeText(
      'https://njump.me/' + nip19.neventEncode({ id: id, author: pubkey } as EventPointer)
    );
    setOpen(false);
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="group inline-flex h-7 w-7 items-center justify-center text-neutral-500 dark:text-neutral-300"
            >
              <HorizontalDotsIcon className="h-5 w-5 group-hover:text-blue-500" />
            </button>
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="-left-10 inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-200 px-3.5 text-sm text-neutral-900 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-800 dark:text-neutral-100">
            More
            <Tooltip.Arrow className="fill-neutral-200 dark:fill-neutral-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex w-[200px] flex-col overflow-hidden rounded-xl border border-neutral-300 bg-neutral-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800">
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => copyLink()}
              className="inline-flex h-10 items-center px-4 text-sm text-neutral-900 hover:bg-neutral-300 focus:outline-none dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              Focus
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => copyLink()}
              className="inline-flex h-10 items-center px-4 text-sm text-neutral-900 hover:bg-neutral-300 focus:outline-none dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              Copy shareable link
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => copyID()}
              className="inline-flex h-10 items-center px-4 text-sm text-neutral-900 hover:bg-neutral-300 focus:outline-none dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              Copy ID
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              to={`/users/${pubkey}`}
              className="inline-flex h-10 items-center px-4 text-sm text-neutral-900 hover:bg-neutral-300 focus:outline-none dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              View profile
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
