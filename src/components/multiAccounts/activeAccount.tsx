import { DEFAULT_AVATAR } from '@stores/constants';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AvatarIcon, ExitIcon, GearIcon } from '@radix-ui/react-icons';
import { writeText } from '@tauri-apps/api/clipboard';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { nip19 } from 'nostr-tools';

export const ActiveAccount = ({ user }: { user: any }) => {
  const router = useRouter();
  const userData = JSON.parse(user.metadata);

  const openProfilePage = () => {
    router.push(`/users/${user.pubkey}`);
  };

  const copyPublicKey = async () => {
    await writeText(nip19.npubEncode(user.pubkey));
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="relative h-11 w-11 rounded-lg">
          <Image
            src={userData.picture || DEFAULT_AVATAR}
            alt="user's avatar"
            fill={true}
            className="rounded-lg object-cover"
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
};
