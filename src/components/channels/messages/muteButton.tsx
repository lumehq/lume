import { RelayContext } from '@components/relaysProvider';

import { dateToUnix } from '@utils/getDate';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import useLocalStorage from '@rehooks/local-storage';
import { MicMute } from 'iconoir-react';
import { getEventHash, signEvent } from 'nostr-tools';
import { useCallback, useContext } from 'react';

export const MuteButton = ({ pubkey }: { pubkey: string }) => {
  const [pool, relays]: any = useContext(RelayContext);
  const [activeAccount]: any = useLocalStorage('activeAccount', {});

  const muteUser = useCallback(() => {
    const event: any = {
      content: '',
      created_at: dateToUnix(),
      kind: 44,
      pubkey: activeAccount.pubkey,
      tags: [['p', pubkey]],
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, activeAccount.privkey);

    // publish note
    pool.publish(event, relays);
  }, [pubkey, activeAccount.privkey, activeAccount.pubkey, pool, relays]);

  return (
    <AlertDialog.Root>
      <Tooltip.Provider>
        <Tooltip.Root>
          <AlertDialog.Trigger asChild>
            <Tooltip.Trigger asChild>
              <button className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-800">
                <MicMute width={16} height={16} className="text-zinc-400" />
              </button>
            </Tooltip.Trigger>
          </AlertDialog.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="select-none rounded-md bg-zinc-800 px-4 py-2 text-sm leading-none text-zinc-100 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
              sideOffset={4}
            >
              Mute user
              <Tooltip.Arrow className="fill-zinc-800" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
        <AlertDialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-zinc-900 p-6 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] ring-1 ring-zinc-800 focus:outline-none data-[state=open]:animate-contentShow">
          <AlertDialog.Title className="m-0 font-medium text-zinc-100">Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description className="mb-5 mt-4 text-zinc-400">
            This action cannot be undone. This will permanently mute this user and you will never receive message from
            this user
          </AlertDialog.Description>
          <div className="flex justify-end gap-4">
            <AlertDialog.Cancel asChild>
              <button
                autoFocus={false}
                className="inline-flex h-9 items-center justify-center rounded px-4 font-medium leading-none text-zinc-200 outline-none hover:bg-zinc-900 focus:shadow-[0_0_0_2px]"
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                autoFocus={false}
                onClick={() => muteUser()}
                className="inline-flex h-9 items-center justify-center rounded bg-red-500 px-4 font-medium leading-none text-white outline-none hover:bg-red-600 focus:shadow-[0_0_0_2px] focus:shadow-red-700"
              >
                Yes, mute this user
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
