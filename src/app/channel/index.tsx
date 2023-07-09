import { useCallback, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { ChannelMembers } from '@app/channel/components/members';
import { ChannelMessageForm } from '@app/channel/components/messages/form';
import { ChannelMetadata } from '@app/channel/components/metadata';

import { useNDK } from '@libs/ndk/provider';

import { useChannelMessages } from '@stores/channels';

import { dateToUnix, getHourAgo } from '@utils/date';
import { LumeEvent } from '@utils/types';

import { ChannelMessageItem } from './components/messages/item';

const now = new Date();

const Header = (
  <div className="relative py-4">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-zinc-800" />
    </div>
    <div className="relative flex justify-center">
      <div className="inline-flex items-center gap-x-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-400 shadow-sm ring-1 ring-inset ring-zinc-800">
        {getHourAgo(24, now).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
    </div>
  </div>
);

const Empty = (
  <div className="flex flex-col gap-1 text-center">
    <h3 className="text-base font-semibold leading-none text-white">
      Nothing to see here yet
    </h3>
    <p className="text-base leading-none text-zinc-400">
      Be the first to share a message in this channel.
    </p>
  </div>
);

export function ChannelScreen() {
  const { ndk } = useNDK();
  const virtuosoRef = useRef(null);

  const { id } = useParams();

  const [messages, fetchMessages, addMessage, clearMessages] = useChannelMessages(
    (state: any) => [state.messages, state.fetch, state.add, state.clear]
  );

  useLayoutEffect(() => {
    fetchMessages(id);
  }, [fetchMessages]);

  useEffect(() => {
    // subscribe to channel
    const sub = ndk.subscribe(
      {
        '#e': [id],
        kinds: [42],
        since: dateToUnix(),
      },
      { closeOnEose: false }
    );

    sub.addListener('event', (event: LumeEvent) => {
      addMessage(id, event);
    });

    return () => {
      clearMessages();
      sub.stop();
    };
  }, []);

  const itemContent: any = useCallback(
    (index: string | number) => {
      return <ChannelMessageItem data={messages[index]} />;
    },
    [messages]
  );

  const computeItemKey = useCallback(
    (index: string | number) => {
      return messages[index].event_id;
    },
    [messages]
  );

  return (
    <div className="grid h-full w-full grid-cols-3">
      <div className="col-span-2 flex flex-col justify-between border-r border-zinc-900">
        <div
          data-tauri-drag-region
          className="inline-flex h-11 w-full shrink-0 items-center justify-center border-b border-zinc-900"
        >
          <h3 className="font-semibold text-zinc-100">Public Channel</h3>
        </div>
        <div className="h-full w-full flex-1 p-3">
          <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900">
            <div className="h-full w-full flex-1">
              {!messages ? (
                <p>Loading...</p>
              ) : (
                <Virtuoso
                  ref={virtuosoRef}
                  data={messages}
                  itemContent={itemContent}
                  computeItemKey={computeItemKey}
                  initialTopMostItemIndex={messages.length - 1}
                  alignToBottom={true}
                  followOutput={true}
                  overscan={50}
                  increaseViewportBy={{ top: 200, bottom: 200 }}
                  className="scrollbar-hide overflow-y-auto"
                  components={{
                    Header: () => Header,
                    EmptyPlaceholder: () => Empty,
                  }}
                />
              )}
            </div>
            <div className="z-50 shrink-0 rounded-b-xl border-t border-zinc-800 bg-zinc-900 p-3 px-5">
              <ChannelMessageForm channelID={id} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1 flex flex-col">
        <div
          data-tauri-drag-region
          className="inline-flex h-11 w-full shrink-0 items-center justify-center border-b border-zinc-900"
        />
        <div className="flex flex-col gap-3 p-3">
          <ChannelMetadata id={id} />
          <ChannelMembers id={id} />
        </div>
      </div>
    </div>
  );
}
