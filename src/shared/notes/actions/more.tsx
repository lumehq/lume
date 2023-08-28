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
      'https://nostr.com/' +
        nip19.neventEncode({ id: id, author: pubkey } as EventPointer)
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
              className="group ml-auto inline-flex h-7 w-7 items-center justify-center"
            >
              <HorizontalDotsIcon className="h-5 w-5 text-white group-hover:text-fuchsia-400" />
            </button>
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="-left-10 select-none rounded-md bg-black px-3.5 py-1.5 text-sm leading-none text-white will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
            More
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex w-[200px] flex-col overflow-hidden rounded-md bg-white/10 p-2 backdrop-blur-3xl backdrop-blur-xl focus:outline-none">
          <DropdownMenu.Item asChild>
            <Link
              to={`/notes/text/${id}`}
              className="inline-flex h-10 items-center rounded-md px-2 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
            >
              Focus mode
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => copyLink()}
              className="inline-flex h-10 items-center rounded-md px-2 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
            >
              Copy shareable link
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => copyID()}
              className="inline-flex h-10 items-center rounded-md px-2 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
            >
              Copy ID
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              to={`/users/${pubkey}`}
              className="inline-flex h-10 items-center rounded-md px-2 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
            >
              View profile
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
