import { NDKKind } from '@nostr-dev-kit/ndk';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { message } from '@tauri-apps/api/dialog';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { useNDK } from '@libs/ndk/provider';

import { LoaderIcon, RepostIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';
import { sendNativeNotification } from '@utils/notification';

export function NoteRepost({ id, pubkey }: { id: string; pubkey: string }) {
  const { publish } = useNostr();
  const { relayUrls } = useNDK();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRepost, setIsRepost] = useState(false);

  const submit = async () => {
    setIsLoading(true);
    const tags = [
      ['e', id, relayUrls[0], 'root'],
      ['p', pubkey],
    ];
    const event = await publish({ content: '', kind: NDKKind.Repost, tags: tags });
    if (event) {
      setOpen(false);
      setIsRepost(true);
      await sendNativeNotification('Reposted successfully', 'Lume');
    } else {
      setIsLoading(false);
      await message('Repost failed, try again later', { title: 'Lume', type: 'error' });
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <AlertDialog.Trigger asChild>
            <button
              type="button"
              className="group inline-flex h-7 w-7 items-center justify-center"
            >
              <RepostIcon
                className={twMerge(
                  'h-5 w-5 group-hover:text-blue-400',
                  isRepost ? 'text-blue-400' : 'text-white'
                )}
              />
            </button>
          </AlertDialog.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="-left-10 select-none rounded-md bg-black px-3.5 py-1.5 text-sm leading-none text-white will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
            Repost
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      <AlertDialog.Portal className="relative z-10">
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl" />
        <AlertDialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-md rounded-xl bg-white/10 backdrop-blur-xl">
            <div className="flex flex-col gap-2 border-b border-white/5 px-5 py-4">
              <AlertDialog.Title className="text-lg font-semibold leading-none text-white">
                Confirm repost this post?
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm leading-tight text-white/50">
                Reposted post will be visible to your followers, and you cannot undo this
                action.
              </AlertDialog.Description>
            </div>
            <div className="flex justify-end gap-2 px-3 py-3">
              <AlertDialog.Cancel asChild>
                <button className="inline-flex h-9 w-20 items-center justify-center rounded-md  text-sm font-medium leading-none text-white outline-none hover:bg-white/10 hover:backdrop-blur-xl">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <button
                type="button"
                onClick={() => submit()}
                className="inline-flex h-9 w-28 items-center justify-center rounded-md bg-white/10 text-sm font-medium leading-none text-white outline-none hover:bg-fuchsia-500"
              >
                {isLoading ? (
                  <LoaderIcon className="h-4 w-4 animate-spin text-white" />
                ) : (
                  'Yes, repost'
                )}
              </button>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
