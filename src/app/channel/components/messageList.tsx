import ChannelMessageItem from '@lume/app/channel/components/messages/item';
import { sortedChannelMessagesAtom } from '@lume/stores/channel';
import { hoursAgo } from '@lume/utils/getDate';

import { useAtomValue } from 'jotai';
import { useCallback, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

export default function ChannelMessageList() {
  const now = useRef(new Date());
  const virtuosoRef = useRef(null);
  const data = useAtomValue(sortedChannelMessagesAtom);

  const itemContent: any = useCallback(
    (index: string | number) => {
      return <ChannelMessageItem data={data[index]} />;
    },
    [data]
  );

  const computeItemKey = useCallback(
    (index: string | number) => {
      return data[index].id;
    },
    [data]
  );

  return (
    <div className="h-full w-full">
      <Virtuoso
        ref={virtuosoRef}
        data={data}
        itemContent={itemContent}
        components={{
          Header: () => (
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center">
                <div className="inline-flex items-center gap-x-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 shadow-sm ring-1 ring-inset ring-zinc-800">
                  {hoursAgo(24, now.current).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          ),
          EmptyPlaceholder: () => (
            <div className="flex flex-col gap-1 text-center">
              <h3 className="text-sm font-semibold leading-none text-zinc-200">Nothing to see here yet</h3>
              <p className="text-sm leading-none text-zinc-400">Be the first to share a message in this channel.</p>
            </div>
          ),
        }}
        computeItemKey={computeItemKey}
        initialTopMostItemIndex={data.length - 1}
        alignToBottom={true}
        followOutput={true}
        overscan={50}
        increaseViewportBy={{ top: 200, bottom: 200 }}
        className="scrollbar-hide h-full w-full overflow-y-auto"
      />
    </div>
  );
}
