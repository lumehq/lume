import { ImageWithFallback } from '@components/imageWithFallback';
import { RelayContext } from '@components/relaysProvider';

import { activeAccountAtom } from '@stores/account';
import { relaysAtom } from '@stores/relays';

import { dateToUnix } from '@utils/getDate';

import destr from 'destr';
import { useAtom, useAtomValue } from 'jotai';
import { getEventHash, signEvent } from 'nostr-tools';
import { useContext, useState } from 'react';

export default function FormComment({ eventID }: { eventID: any }) {
  const pool: any = useContext(RelayContext);

  const relays = useAtomValue(relaysAtom);
  const [activeAccount] = useAtom(activeAccountAtom);
  const [value, setValue] = useState('');

  const profile = destr(activeAccount.metadata);

  const submitEvent = () => {
    const event: any = {
      content: value,
      created_at: dateToUnix(),
      kind: 1,
      pubkey: activeAccount.id,
      tags: [['e', eventID]],
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, activeAccount.privkey);

    // publish note
    pool.publish(event, relays);
    // send notification
    // sendNotification('Comment has been published successfully');
  };

  return (
    <div className="p-3">
      <div className="flex gap-1">
        <div>
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-white/10">
            <ImageWithFallback
              src={profile?.picture}
              alt={activeAccount.id}
              fill={true}
              className="rounded-md object-cover"
            />
          </div>
        </div>
        <div className="relative h-24 w-full flex-1 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
          <div>
            <textarea
              name="content"
              onChange={(e) => setValue(e.target.value)}
              placeholder="Send your comment"
              className="relative h-24 w-full resize-none rounded-md border border-black/5 px-3.5 py-3 text-sm shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
              spellCheck={false}
            />
          </div>
          <div className="absolute bottom-2 w-full px-2">
            <div className="flex w-full items-center justify-between bg-zinc-800">
              <div className="flex items-center gap-2 divide-x divide-zinc-700"></div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => submitEvent()}
                  className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-sm font-medium shadow-md shadow-fuchsia-900/50 hover:bg-fuchsia-600"
                >
                  <span className="text-white drop-shadow">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
