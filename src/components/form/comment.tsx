import { ImageWithFallback } from '@components/imageWithFallback';
import { RelayContext } from '@components/relaysProvider';

import { activeAccountAtom } from '@stores/account';
import { noteContentAtom } from '@stores/note';
import { relaysAtom } from '@stores/relays';

import { dateToUnix } from '@utils/getDate';

import destr from 'destr';
import { useAtom, useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { getEventHash, signEvent } from 'nostr-tools';
import { useContext } from 'react';

export default function FormComment({ eventID }: { eventID: string }) {
  const pool: any = useContext(RelayContext);

  const relays = useAtomValue(relaysAtom);
  const [activeAccount] = useAtom(activeAccountAtom);
  const [value, setValue] = useAtom(noteContentAtom);
  const resetValue = useResetAtom(noteContentAtom);

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

    pool.publish(event, relays);
    resetValue;
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
              <div className="flex items-center gap-2 divide-x divide-zinc-700">
                <div className="flex items-center gap-2 pl-2">
                  <span className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-zinc-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4 text-zinc-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                      />
                    </svg>
                  </span>
                  <span className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-zinc-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4 text-zinc-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
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
