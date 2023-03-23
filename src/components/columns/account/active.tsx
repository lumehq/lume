import { DatabaseContext } from '@components/contexts/database';
import { RelayContext } from '@components/contexts/relay';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AvatarIcon, ExitIcon, GearIcon } from '@radix-ui/react-icons';
import useLocalStorage from '@rehooks/local-storage';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { memo, useCallback, useContext, useMemo } from 'react';

export const ActiveAccount = memo(function ActiveAccount({ user }: { user: any }) {
  const router = useRouter();
  const userData = JSON.parse(user.metadata);

  const { db }: any = useContext(DatabaseContext);
  const relayPool: any = useContext(RelayContext);

  const [relays]: any = useLocalStorage('relays');
  const [currentUser]: any = useLocalStorage('current-user');

  const openProfile = () => {
    router.push(`/users/${currentUser.id}`);
  };

  // save follows to database
  const insertFollows = useCallback(
    async (follows) => {
      follows.forEach(async (item) => {
        if (item) {
          // insert to database
          await db.execute(
            `INSERT OR IGNORE INTO follows (pubkey, account, kind) VALUES ("${item[1]}", "${currentUser.id}", "0")`
          );
        }
      });
    },
    [db, currentUser.id]
  );

  useMemo(() => {
    relayPool.subscribe(
      [
        {
          kinds: [3],
          authors: [currentUser.id],
        },
      ],
      relays,
      (event: any) => {
        insertFollows(event.tags);
      },
      undefined,
      undefined,
      {
        unsubscribeOnEose: true,
      }
    );
  }, [currentUser.id, insertFollows, relayPool, relays]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="relative h-11 w-11 shrink rounded-lg ring-1 ring-fuchsia-500 ring-offset-2 ring-offset-black">
          <Image src={userData.picture} alt="user's avatar" fill={true} className="rounded-lg object-cover" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] rounded-lg bg-zinc-800 p-1.5 shadow-modal will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          side="right"
          sideOffset={5}
          align="start"
        >
          <DropdownMenu.Item
            onClick={() => openProfile()}
            className="group relative flex h-7 select-none items-center rounded-sm px-1 pl-7 text-sm leading-none text-zinc-400 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-700 data-[highlighted]:text-fuchsia-500"
          >
            <div className="absolute left-0 inline-flex w-6 items-center justify-center">
              <AvatarIcon />
            </div>
            Open profile
          </DropdownMenu.Item>
          <DropdownMenu.Item className="group relative flex h-7 select-none items-center rounded px-1 pl-7 text-sm leading-none text-zinc-400 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-700 data-[highlighted]:text-fuchsia-500">
            Update profile
          </DropdownMenu.Item>
          <DropdownMenu.Item className="group relative flex h-7 select-none items-center rounded px-1 pl-7 text-sm leading-none text-zinc-400 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-700 data-[highlighted]:text-fuchsia-500">
            Copy public key
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="m-1 h-px bg-zinc-700/50" />
          <DropdownMenu.Item className="group relative flex h-7 select-none items-center rounded px-1 pl-7 text-sm leading-none text-zinc-400 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-700 data-[highlighted]:text-fuchsia-500">
            <div className="absolute left-0 inline-flex w-6 items-center justify-center">
              <GearIcon />
            </div>
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item className="group relative flex h-7 select-none items-center rounded px-1 pl-7 text-sm leading-none text-zinc-400 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-700 data-[highlighted]:text-fuchsia-500">
            <div className="absolute left-0 inline-flex w-6 items-center justify-center">
              <ExitIcon />
            </div>
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
});
