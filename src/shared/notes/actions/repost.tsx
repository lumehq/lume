import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useState } from 'react';

import { RepostIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function NoteRepost({ id, pubkey }: { id: string; pubkey: string }) {
  const { publish } = useNostr();
  const [open, setOpen] = useState(false);

  const submit = async () => {
    const tags = [
      ['e', id, 'wss://relayable.org', 'root'],
      ['p', pubkey],
    ];
    const event = await publish({ content: '', kind: 6, tags: tags });
    if (event) {
      setOpen(false);
    } else {
      console.log('failed reposting');
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
              <RepostIcon className="h-5 w-5 text-white group-hover:text-blue-400" />
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
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl" />
        <AlertDialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-white/10">
            <div className="flex flex-col gap-2 border-b border-white/5 px-5 py-4">
              <AlertDialog.Title className="text-lg font-semibold leading-none text-white">
                Confirm repost this post?
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm leading-none text-white/50">
                Reposted post will be visible to your followers, and you cannot undo this
                action.
              </AlertDialog.Description>
            </div>
            <div className="flex justify-end gap-6 px-5 py-3">
              <AlertDialog.Cancel asChild>
                <button className="inline-flex h-11 items-center justify-center rounded-lg bg-white/10 px-4 font-medium leading-none text-white outline-none">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <button
                type="button"
                onClick={() => submit()}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-fuchsia-500 px-4 font-medium leading-none text-white outline-none"
              >
                Yes, repost
              </button>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
