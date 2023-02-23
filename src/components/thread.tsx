import { Placeholder } from '@components/note/placeholder';
import { Repost } from '@components/note/repost';
import { Single } from '@components/note/single';

import { useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Thread({ data }: { data: any }) {
  const ItemContent = useCallback(
    (index: string | number) => {
      const event = data[index];

      if (event.content.includes('#[0]') && event.tags[0][0] == 'e') {
        // type: repost
        return <Repost root={event.tags} user={event.pubkey} />;
      } else {
        // type: default
        return <Single event={event} />;
      }
    },
    [data]
  );

  const computeItemKey = useCallback(
    (index) => {
      return data[index].id;
    },
    [data]
  );

  return (
    <Virtuoso
      data={data}
      itemContent={ItemContent}
      components={{
        EmptyPlaceholder: () => <Placeholder />,
        ScrollSeekPlaceholder: () => <Placeholder />,
      }}
      computeItemKey={computeItemKey}
      scrollSeekConfiguration={{
        enter: (velocity) => Math.abs(velocity) > 800,
        exit: (velocity) => Math.abs(velocity) < 500,
      }}
      overscan={800}
      increaseViewportBy={1000}
      className="scrollbar-hide relative h-full w-full rounded-lg"
      style={{
        contain: 'strict',
      }}
    />
  );
}
