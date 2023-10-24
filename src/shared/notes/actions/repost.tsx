import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useState } from 'react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import { useNDK } from '@libs/ndk/provider';

import { LoaderIcon, RepostIcon } from '@shared/icons';

export function NoteRepost({ id, pubkey }: { id: string; pubkey: string }) {
  const { ndk, relayUrls } = useNDK();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRepost, setIsRepost] = useState(false);

  const submit = async () => {
    setIsLoading(true);

    const tags = [
      ['e', id, relayUrls[0], 'root'],
      ['p', pubkey],
    ];

    const event = new NDKEvent(ndk);
    event.content = '';
    event.kind = NDKKind.Repost;
    event.tags = tags;

    const publishedRelays = await event.publish();
    if (publishedRelays) {
      setOpen(false);
      setIsRepost(true);

      toast.success(`Broadcasted to ${publishedRelays.size} relays successfully.`);
    } else {
      setIsLoading(false);
      toast.error('Repost failed, try again later');
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <AlertDialog.Trigger asChild>
            <button
              type="button"
              className="group inline-flex h-7 w-7 items-center justify-center text-neutral-600 dark:text-neutral-400"
            >
              <RepostIcon
                className={twMerge(
                  'h-5 w-5 group-hover:text-blue-600',
                  isRepost ? 'text-blue-500' : ''
                )}
              />
            </button>
          </AlertDialog.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="-left-10 inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-200 px-3.5 text-sm text-neutral-900 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-800 dark:text-neutral-100">
            Repost
            <Tooltip.Arrow className="fill-neutral-200 dark:fill-neutral-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm dark:bg-white/20" />
        <AlertDialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-md rounded-xl bg-white dark:bg-black">
            <div className="flex flex-col gap-2 border-b border-neutral-100 px-5 py-6 dark:border-neutral-900">
              <AlertDialog.Title className="text-lg font-semibold leading-none text-neutral-900 dark:text-neutral-100">
                Confirm repost this post?
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm leading-tight text-neutral-600 dark:text-neutral-400">
                Reposted post will be visible to your followers, and you cannot undo this
                action.
              </AlertDialog.Description>
            </div>
            <div className="flex justify-end gap-2 px-3 py-3">
              <AlertDialog.Cancel asChild>
                <button className="inline-flex h-9 w-20 items-center justify-center rounded-md text-sm font-medium text-neutral-600 outline-none hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <button
                type="button"
                onClick={() => submit()}
                className="inline-flex h-9 w-24 items-center justify-center rounded-md bg-blue-500 text-sm font-medium leading-none text-white outline-none hover:bg-blue-600"
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
