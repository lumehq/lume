import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { writeText } from '@tauri-apps/api/clipboard';
import { useRouter } from 'next/router';
import { nip19 } from 'nostr-tools';
import { memo } from 'react';

export const ProfileMenu = memo(function ProfileMenu({ pubkey }: { pubkey: string }) {
  const router = useRouter();

  const viewProfile = () => {
    router.push(`/profile/${pubkey}`);
  };

  const updateProfile = () => {
    router.push('/profile/update');
  };

  const copyPubkey = async () => {
    const npub = nip19.npubEncode(pubkey);
    await writeText(npub);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="rounded-lg p-1 hover:bg-zinc-800">
          <DotsHorizontalIcon className="h-4 w-4 text-zinc-300" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] rounded-md border border-white/20 bg-zinc-800 p-1 shadow-lg shadow-black/30 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={2}
        >
          <DropdownMenu.Item
            onClick={() => viewProfile()}
            className="group relative flex h-[30px] select-none items-center rounded px-1 pl-6 text-sm leading-none text-zinc-100 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-700 data-[highlighted]:text-fuchsia-400 data-[disabled]:text-zinc-400"
          >
            View profile
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => updateProfile()}
            className="group relative flex h-[30px] select-none items-center rounded px-1 pl-6 text-sm leading-none text-zinc-100 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-700 data-[highlighted]:text-fuchsia-400 data-[disabled]:text-zinc-400"
          >
            Update profile
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => copyPubkey()}
            className="group relative flex h-[30px] select-none items-center rounded px-1 pl-6 text-sm leading-none text-zinc-100 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-700 data-[highlighted]:text-fuchsia-400 data-[disabled]:text-zinc-400"
          >
            Copy public key
          </DropdownMenu.Item>
          <DropdownMenu.Item className="group relative flex h-[30px] select-none items-center rounded px-1 pl-6 text-sm leading-none text-zinc-100 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-700 data-[highlighted]:text-fuchsia-400 data-[disabled]:text-zinc-400">
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
});
