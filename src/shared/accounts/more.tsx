import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { HorizontalDotsIcon } from '@shared/icons';
import { Logout } from '@shared/logout';

export function AccountMoreActions({ pubkey }: { pubkey: string }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md"
        >
          <HorizontalDotsIcon className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="ml-2 flex w-[200px] flex-col overflow-hidden rounded-xl bg-blue-500 p-2 focus:outline-none">
          <DropdownMenu.Item asChild>
            <Link
              to={`/users/${pubkey}`}
              className="inline-flex h-10 items-center rounded-lg px-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none"
            >
              Profile
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              to={`/settings/backup`}
              className="inline-flex h-10 items-center rounded-lg px-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none"
            >
              Backup
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              to={`/settings/`}
              className="inline-flex h-10 items-center rounded-lg px-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none"
            >
              Settings
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Logout />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
