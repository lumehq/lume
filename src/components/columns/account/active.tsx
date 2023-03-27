import { RelayContext } from '@components/relaysProvider';

import { relaysAtom } from '@stores/relays';

import { dateToUnix } from '@utils/getDate';
import { createFollows } from '@utils/storage';
import { tagsToArray } from '@utils/transform';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AvatarIcon, ExitIcon, GearIcon } from '@radix-ui/react-icons';
import destr from 'destr';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { memo, useContext, useEffect, useRef } from 'react';

export const ActiveAccount = memo(function ActiveAccount({ user }: { user: any }) {
  const pool: any = useContext(RelayContext);
  const relays = useAtomValue(relaysAtom);

  const router = useRouter();
  const userData = destr(user.metadata);

  const now = useRef(new Date());

  const openProfile = () => {
    router.push(`/users/${user.id}`);
  };

  useEffect(() => {
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [3],
          authors: [user.id],
          since: dateToUnix(now.current),
        },
      ],
      relays,
      (event: any) => {
        if (event.tags.length > 0) {
          createFollows(tagsToArray(event.tags), user.id, 0);
        }
      },
      undefined,
      undefined,
      {
        unsubscribeOnEose: true,
      }
    );

    return () => {
      unsubscribe;
    };
  }, [pool, relays, user.id]);

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
