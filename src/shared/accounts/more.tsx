import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { HorizontalDotsIcon } from '@shared/icons';

export function AccountMoreActions({ pubkey }: { pubkey: string }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="group ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-white/10"
        >
          <HorizontalDotsIcon className="h-5 w-5 text-white/80 group-hover:text-white" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="flex w-[200px] flex-col overflow-hidden rounded-xl bg-white/10 p-2 backdrop-blur-3xl focus:outline-none">
          <DropdownMenu.Item asChild>
            <Link
              to={`/users/${pubkey}`}
              className="inline-flex h-10 items-center rounded-lg px-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none"
            >
              Profile
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              to={`/settings/backup`}
              className="inline-flex h-10 items-center rounded-lg px-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none"
            >
              Backup
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              to={`/settings/`}
              className="inline-flex h-10 items-center rounded-lg px-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none"
            >
              Settings
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button className="inline-flex h-10 items-center rounded-lg px-2 text-sm font-medium text-white hover:bg-white/10">
              Logout
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
