import { RelayContext } from '@components/relaysProvider';

import { dateToUnix } from '@utils/getDate';
import { createFollows } from '@utils/storage';
import { tagsToArray } from '@utils/transform';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AvatarIcon, ExitIcon, GearIcon } from '@radix-ui/react-icons';
import { writeText } from '@tauri-apps/api/clipboard';
import destr from 'destr';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { nip19 } from 'nostr-tools';
import { memo, useContext, useEffect, useRef } from 'react';

export const ActiveAccount = memo(function ActiveAccount({ user }: { user: any }) {
  const [pool, relays]: any = useContext(RelayContext);

  const router = useRouter();
  const userData = destr(user.metadata);

  const now = useRef(new Date());

  const openProfilePage = () => {
    router.push(`/users/${user.id}`);
  };

  const copyPublicKey = async () => {
    await writeText(nip19.npubEncode(user.id));
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
        <button className="relative h-11 w-11 rounded-md">
          <Image
            src={userData.picture}
            alt="user's avatar"
            fill={true}
            className="rounded-md object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
            priority
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] rounded-md bg-zinc-900/80 p-1.5 shadow-input shadow-black/50 ring-1 ring-zinc-800 backdrop-blur-xl will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          side="right"
          sideOffset={5}
          align="start"
        >
          <DropdownMenu.Item
            onClick={() => openProfilePage()}
            className="group relative flex h-7 select-none items-center rounded-sm px-1 pl-7 text-sm leading-none text-zinc-400 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-800 data-[highlighted]:text-fuchsia-500"
          >
            <div className="absolute left-0 inline-flex w-6 items-center justify-center">
              <AvatarIcon />
            </div>
            Open profile
          </DropdownMenu.Item>
          <DropdownMenu.Item className="group relative flex h-7 select-none items-center rounded px-1 pl-7 text-sm leading-none text-zinc-400 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-800 data-[highlighted]:text-fuchsia-500">
            Update profile
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => copyPublicKey()}
            className="group relative flex h-7 select-none items-center rounded px-1 pl-7 text-sm leading-none text-zinc-400 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-800 data-[highlighted]:text-fuchsia-500"
          >
            Copy public key
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="m-1 h-px bg-zinc-700/50" />
          <DropdownMenu.Item className="group relative flex h-7 select-none items-center rounded px-1 pl-7 text-sm leading-none text-zinc-400 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-800 data-[highlighted]:text-fuchsia-500">
            <div className="absolute left-0 inline-flex w-6 items-center justify-center">
              <GearIcon />
            </div>
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item className="group relative flex h-7 select-none items-center rounded px-1 pl-7 text-sm leading-none text-zinc-400 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-800 data-[highlighted]:text-fuchsia-500">
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
