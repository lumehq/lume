/* eslint-disable @typescript-eslint/no-explicit-any */
import { RelayContext } from '@components/contexts/relay';
import { UserRepost } from '@components/note/atoms/userRepost';
import { Content } from '@components/note/content';
import { Placeholder } from '@components/note/placeholder';

import * as Dialog from '@radix-ui/react-dialog';
import { LoopIcon } from '@radix-ui/react-icons';
import useLocalStorage from '@rehooks/local-storage';
import dynamic from 'next/dynamic';
import { memo, useContext, useState } from 'react';

const Modal = dynamic(() => import('@components/note/modal'), {
  ssr: false,
  loading: () => <></>,
});

export const Repost = memo(function Repost({ root, user }: { root: any; user: string }) {
  const relayPool: any = useContext(RelayContext);
  const [relays]: any = useLocalStorage('relays');
  const [events, setEvents] = useState([]);

  relayPool.subscribe(
    [
      {
        ids: [root[0][1]],
        since: 0,
        kinds: [1],
      },
    ],
    relays,
    (event: any) => {
      setEvents((events) => [event, ...events]);
    },
    undefined,
    (events: any, relayURL: any) => {
      console.log(events, relayURL);
    }
  );

  if (events !== null && Object.keys(events).length > 0) {
    return (
      <Dialog.Root>
        <Dialog.Trigger>
          <div className="flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 py-6 px-6">
            <div className="flex items-center gap-1 pl-8 text-sm">
              <LoopIcon className="h-4 w-4 text-zinc-400" />
              <div className="ml-2">
                <UserRepost pubkey={user} />
              </div>
            </div>
            {events[0].content && <Content data={events[0]} />}
          </div>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed inset-0 overflow-y-auto">{events[0].content && <Modal event={events[0]} />}</Dialog.Content>
          </Dialog.Portal>
        </Dialog.Trigger>
      </Dialog.Root>
    );
  } else {
    return (
      <div className="border-b border-zinc-800">
        <Placeholder />
      </div>
    );
  }
});
