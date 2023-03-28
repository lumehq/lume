import { UserMini } from '@components/user/mini';

import { useVirtualizer } from '@tanstack/react-virtual';
import { Suspense, memo, useRef } from 'react';

export const MessageList = memo(function MessageList({ data }: { data: any }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    estimateSize: () => 32,
    getScrollElement: () => parentRef.current,
  });
  const items = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className="scrollbar-hide h-full w-full overflow-y-auto" style={{ contain: 'strict' }}>
      <Suspense fallback={<p className="text-sm text-zinc-400">Loading...</p>}>
        {items.length > 0 && (
          <div className="relative mb-24 w-full" style={{ height: virtualizer.getTotalSize() }}>
            <div className="absolute top-0 left-0 w-full" style={{ transform: `translateY(${items[0].start}px)` }}>
              {items.map((virtualRow) => (
                <div key={virtualRow.key} data-index={virtualRow.index} ref={virtualizer.measureElement}>
                  <UserMini pubkey={data[virtualRow.index].pubkey} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
});
