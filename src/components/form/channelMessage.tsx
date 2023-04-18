import ImagePicker from '@components/form/imagePicker';
import { RelayContext } from '@components/relaysProvider';
import { UserMini } from '@components/user/mini';

import { channelReplyAtom } from '@stores/channel';

import { dateToUnix } from '@utils/getDate';

import useLocalStorage from '@rehooks/local-storage';
import { Cancel } from 'iconoir-react';
import { useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { getEventHash, signEvent } from 'nostr-tools';
import { useCallback, useContext, useState } from 'react';

export default function FormChannelMessage({ eventId }: { eventId: string | string[] }) {
  const [pool, relays]: any = useContext(RelayContext);

  const [value, setValue] = useState('');
  const [activeAccount]: any = useLocalStorage('account', {});

  const channelReply = useAtomValue(channelReplyAtom);
  const resetChannelReply = useResetAtom(channelReplyAtom);

  const submitEvent = useCallback(() => {
    let tags;

    if (channelReply.id !== null) {
      tags = [
        ['e', eventId, '', 'root'],
        ['e', channelReply.id, '', 'reply'],
        ['p', channelReply.pubkey, ''],
      ];
    } else {
      tags = [['e', eventId, '', 'root']];
    }

    const event: any = {
      content: value,
      created_at: dateToUnix(),
      kind: 42,
      pubkey: activeAccount.pubkey,
      tags: tags,
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, activeAccount.privkey);

    // publish note
    pool.publish(event, relays);
    // reset state
    setValue('');
    // reset channel reply
    resetChannelReply();
  }, [
    value,
    channelReply.id,
    channelReply.pubkey,
    activeAccount.pubkey,
    activeAccount.privkey,
    eventId,
    resetChannelReply,
    pool,
    relays,
  ]);

  const handleEnterPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitEvent();
    }
  };

  const stopReply = () => {
    resetChannelReply();
  };

  return (
    <div
      className={`relative ${
        channelReply.id ? 'h-36' : 'h-24'
      } w-full shrink-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-2 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20`}
    >
      {channelReply.id && (
        <div className="absolute left-0 top-0 z-10 h-14 w-full p-[2px]">
          <div className="flex h-full w-full items-center justify-between rounded-t-md border-b border-zinc-700/70 bg-zinc-900 px-3">
            <div className="flex w-full flex-col">
              <UserMini pubkey={channelReply.pubkey} />
              <div className="-mt-3.5 pl-[32px]">
                <div className="text-xs text-zinc-200">{channelReply.content}</div>
              </div>
            </div>
            <button
              onClick={() => stopReply()}
              className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-800"
            >
              <Cancel width={12} height={12} className="text-zinc-100" />
            </button>
          </div>
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleEnterPress}
        spellCheck={false}
        placeholder="Message"
        className={`relative ${
          channelReply.id ? 'h-36 pt-16' : 'h-24 pt-3'
        } w-full resize-none rounded-lg border border-black/5 px-3.5 pb-3 text-sm shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500`}
      />
      <div className="absolute bottom-2 w-full px-2">
        <div className="flex w-full items-center justify-between bg-zinc-800">
          <div className="flex items-center gap-2 divide-x divide-zinc-700">
            <ImagePicker />
            <div className="flex items-center gap-2 pl-2"></div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => submitEvent()}
              disabled={value.length === 0 ? true : false}
              className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-sm font-medium shadow-button hover:bg-fuchsia-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
